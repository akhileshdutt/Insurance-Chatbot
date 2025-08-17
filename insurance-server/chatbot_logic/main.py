# import os
# import tempfile
# import shutil
# import json
# import uuid
# import faiss
# import numpy as np
# import re
# from typing import List, Dict, Any
# from fastapi import FastAPI, Request, Depends, HTTPException, status, Security
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# import pypdf
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# import nest_asyncio
# import asyncio
# import aiohttp

# from dotenv import load_dotenv
# from openai import OpenAI
# from sentence_transformers import SentenceTransformer

# # Load .env explicitly from the same folder as main.py, no matter where uvicorn is run from
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# # load_dotenv(os.path.join(BASE_DIR, ".env"))
# load_dotenv(os.path.join(os.path.dirname(BASE_DIR), ".env"))

# # Use OS temp directory to reduce permanent disk usage (works well on cloud hosts)
# BASE_PATH = tempfile.gettempdir()
# PARSED_TEXT_OUTPUT_FOLDER = os.path.join(BASE_PATH, "Parsed_text")

# EMBEDDING_MODEL_NAME = 'all-MiniLM-L6-v2'
# TOP_K_RETRIEVAL = 5

# # Ensure folders exist
# os.makedirs(PARSED_TEXT_OUTPUT_FOLDER, exist_ok=True)

# nest_asyncio.apply()

# app = FastAPI(title="Bajaj PDF QnA Pipeline API")

# bearer_scheme = HTTPBearer(auto_error=False)
# VALID_TOKEN = os.getenv("VALID_TOKEN", "ssbakscstobcb3609e845e387e9f7ac988ea36090473eefbe6dae9cfe880c35c6b67d87a7757")

# def verify_token(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)):
#     if credentials is None or credentials.scheme.lower() != "bearer":
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Missing or invalid authorization scheme",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     token = credentials.credentials
#     if token != VALID_TOKEN:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Invalid token",
#         )
#     return token

# def parse_and_chunk_pdf(file_path: str) -> List[Dict[str, Any]]:
#     all_page_texts = []
#     with open(file_path, "rb") as f:
#         reader = pypdf.PdfReader(f)
#         for i, page in enumerate(reader.pages):
#             page_text = page.extract_text()
#             if page_text:
#                 all_page_texts.append({"text": page_text, "page_number": i + 1})

#     if not all_page_texts:
#         return []

#     text_splitter = RecursiveCharacterTextSplitter(
#         chunk_size=500, chunk_overlap=50, length_function=len, is_separator_regex=False
#     )

#     processed_chunks = []
#     for page_info in all_page_texts:
#         chunks_from_page = text_splitter.split_text(page_info["text"])
#         for chunk_content in chunks_from_page:
#             clean_chunk = " ".join(chunk_content.split()).strip()
#             if clean_chunk:
#                 processed_chunks.append({
#                     "content": clean_chunk,
#                     "metadata": {
#                         "page_number": page_info["page_number"],
#                         "source_file": os.path.basename(file_path),
#                     },
#                 })
#     return processed_chunks

# embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME, cache_folder="/tmp/hf_cache")

# def clean_query(query: str) -> str:
#     cleaned_text = "".join(char for char in query if char.isalnum() or char.isspace()).strip()
#     return re.sub(r"\\s+", " ", cleaned_text)

# def normalize_vectors(vecs: np.ndarray) -> np.ndarray:
#     norms = np.linalg.norm(vecs, axis=1, keepdims=True)
#     norms[norms == 0] = 1e-12
#     return vecs / norms

# async def call_llm_api(prompt_messages: List[Dict[str, str]], json_output: bool = False) -> str:
#     TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
#     if not TOGETHER_API_KEY:
#         raise RuntimeError("TOGETHER_API_KEY not set in environment.")
#     client = OpenAI(api_key=TOGETHER_API_KEY, base_url="https://api.together.xyz/v1/")
#     payload = {
#         "model": "mistralai/Mistral-7B-Instruct-v0.2",
#         "messages": prompt_messages,
#         "temperature": 0.2,
#         "max_tokens": 1024,
#     }
#     if json_output:
#         payload["response_format"] = {"type": "json_object"}
#     response = client.chat.completions.create(**payload)
#     return response.choices[0].message.content

# def retrieve_top_k(query: str, k: int, faiss_index, metadata: List[Dict[str, Any]], embedder) -> List[Dict[str, Any]]:
#     if faiss_index.ntotal == 0:
#         return []
#     query_vector = embedder.encode([query]).astype("float32")
#     query_vector = normalize_vectors(query_vector)
#     D, I = faiss_index.search(query_vector, k)
#     results = []
#     for idx in I[0]:
#         if 0 <= idx < len(metadata):
#             chunk = metadata[idx].copy()
#             results.append(chunk)
#     return results

# def construct_rag_prompt(user_query: str, context_chunks: List[Dict[str, Any]]) -> str:
#     if not context_chunks:
#         return f"No document context found. Please try again.\n\nUSER QUERY:\n{user_query}"
#     context_text = "\n\n".join([
#         f"--- Page {chunk['metadata'].get('page_number', '?')} ---\n{chunk['content']}"
#         for chunk in context_chunks
#     ])
#     return f"""You are a helpful insurance assistant. Use the context below to answer the question.
# If the answer is not in the context, say so clearly.

# USER QUERY:
# {user_query}

# DOCUMENT CONTEXT:
# {context_text}
# """

# async def download_pdf_from_url(url: str, save_path: str):
#     async with aiohttp.ClientSession() as session:
#         async with session.get(url) as response:
#             if response.status != 200:
#                 raise HTTPException(status_code=400, detail=f"Failed to download PDF: {response.status}")
#             with open(save_path, "wb") as f:
#                 f.write(await response.read())

# @app.post("/hackrx/run")
# async def hackrx_run_api(
#     request: Request,
#     token: str = Depends(verify_token),
# ):
#     body = await request.json()
#     pdf_url = body.get("documents")
#     questions = body.get("questions", [])
#     if not pdf_url or not questions:
#         raise HTTPException(status_code=422, detail="Missing required fields: 'documents' or 'questions'")

#     unique_pdf_name = f"{uuid.uuid4()}.pdf"
#     pdf_path = os.path.join(PARSED_TEXT_OUTPUT_FOLDER, unique_pdf_name)
#     await download_pdf_from_url(pdf_url, pdf_path)

#     try:
#         all_chunks = parse_and_chunk_pdf(pdf_path)
#     except Exception as e:
#         return {"error": f"Error parsing PDF: {e}"}

#     chunk_contents = [chunk["content"] for chunk in all_chunks]
#     chunk_metadatas = [chunk["metadata"] for chunk in all_chunks]
#     try:
#         embeddings = embedding_model.encode(chunk_contents, show_progress_bar=False)
#         embeddings = np.array(embeddings).astype("float32")
#         faiss_index = faiss.IndexFlatL2(embeddings.shape[1])
#         faiss_index.add(embeddings)
#     except Exception as e:
#         return {"error": f"Error during embedding or FAISS index creation: {e}"}

#     answers = []
#     for question in questions:
#         top_chunks = retrieve_top_k(clean_query(question), TOP_K_RETRIEVAL, faiss_index, all_chunks, embedding_model)
#         prompt = construct_rag_prompt(question, top_chunks)
#         try:
#             llm_response = await call_llm_api([
#                 {"role": "system", "content": "You are a helpful insurance assistant."},
#                 {"role": "user", "content": prompt}
#             ])
#             answers.append(llm_response.strip())
#         except Exception as e:
#             answers.append(f"Error answering question: {str(e)}")

#     return {"answers": answers}


import os
import tempfile
import shutil
import json
import uuid
import faiss
import numpy as np
import re
from typing import List, Dict, Any
from fastapi import FastAPI, Request, Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import pypdf
from langchain_text_splitters import RecursiveCharacterTextSplitter
import nest_asyncio
import asyncio
import aiohttp

from dotenv import load_dotenv
from openai import OpenAI
from sentence_transformers import SentenceTransformer

# Load .env explicitly from the same folder as main.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(os.path.dirname(BASE_DIR), ".env"))

# Use OS temp directory
BASE_PATH = tempfile.gettempdir()
PARSED_TEXT_OUTPUT_FOLDER = os.path.join(BASE_PATH, "Parsed_text")

EMBEDDING_MODEL_NAME = 'all-MiniLM-L6-v2'
TOP_K_RETRIEVAL = 5

os.makedirs(PARSED_TEXT_OUTPUT_FOLDER, exist_ok=True)

nest_asyncio.apply()

app = FastAPI(title="Insurance Chatbot")

bearer_scheme = HTTPBearer(auto_error=False)
VALID_TOKEN = os.getenv("VALID_TOKEN", "ssbakscstobcb3609e845e387e9f7ac988ea36090473eefbe6dae9cfe880c35c6b67d87a7757")

def verify_token(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization scheme",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    if token != VALID_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token",
        )
    return token

def parse_and_chunk_pdf(file_path: str) -> List[Dict[str, Any]]:
    # ... (Your existing parse_and_chunk_pdf function) ...
    all_page_texts = []
    with open(file_path, "rb") as f:
        reader = pypdf.PdfReader(f)
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                all_page_texts.append({"text": page_text, "page_number": i + 1})

    if not all_page_texts:
        return []

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, chunk_overlap=50, length_function=len, is_separator_regex=False
    )

    processed_chunks = []
    for page_info in all_page_texts:
        chunks_from_page = text_splitter.split_text(page_info["text"])
        for chunk_content in chunks_from_page:
            clean_chunk = " ".join(chunk_content.split()).strip()
            if clean_chunk:
                processed_chunks.append({
                    "content": clean_chunk,
                    "metadata": {
                        "page_number": page_info["page_number"],
                        "source_file": os.path.basename(file_path),
                    },
                })
    return processed_chunks

embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME, cache_folder="/tmp/hf_cache")

def clean_query(query: str) -> str:
    cleaned_text = "".join(char for char in query if char.isalnum() or char.isspace()).strip()
    return re.sub(r"\\s+", " ", cleaned_text)

def normalize_vectors(vecs: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(vecs, axis=1, keepdims=True)
    norms[norms == 0] = 1e-12
    return vecs / norms

async def call_llm_api(prompt_messages: List[Dict[str, str]], json_output: bool = False) -> str:
    TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
    if not TOGETHER_API_KEY:
        raise RuntimeError("TOGETHER_API_KEY not set in environment.")
    client = OpenAI(api_key=TOGETHER_API_KEY, base_url="https://api.together.xyz/v1/")
    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.2",
        "messages": prompt_messages,
        "temperature": 0.2,
        "max_tokens": 1024,
    }
    if json_output:
        payload["response_format"] = {"type": "json_object"}
    response = client.chat.completions.create(**payload)
    return response.choices[0].message.content

def retrieve_top_k(query: str, k: int, faiss_index, metadata: List[Dict[str, Any]], embedder) -> List[Dict[str, Any]]:
    if faiss_index.ntotal == 0:
        return []
    query_vector = embedder.encode([query]).astype("float32")
    query_vector = normalize_vectors(query_vector)
    D, I = faiss_index.search(query_vector, k)
    results = []
    for idx in I[0]:
        if 0 <= idx < len(metadata):
            chunk = metadata[idx].copy()
            results.append(chunk)
    return results

def construct_rag_prompt(user_query: str, context_chunks: List[Dict[str, Any]]) -> str:
    if not context_chunks:
        return f"No document context found. Please try again.\n\nUSER QUERY:\n{user_query}"
    context_text = "\n\n".join([
        f"--- Page {chunk['metadata'].get('page_number', '?')} ---\n{chunk['content']}"
        for chunk in context_chunks
    ])
    return f"""You are a helpful insurance assistant. Use the context below to answer the question.
If the answer is not in the context, say so clearly.

USER QUERY:
{user_query}

DOCUMENT CONTEXT:
{context_text}
"""

async def download_pdf_from_url(url: str, save_path: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status != 200:
                raise HTTPException(status_code=400, detail=f"Failed to download PDF: {response.status}")
            with open(save_path, "wb") as f:
                f.write(await response.read())

# Global cache to store Faiss index and chunks for a session
processed_documents_cache = {}

# New endpoint for processing a document URL
@app.post("/process_document")
async def process_document_api(request: Request, token: str = Depends(verify_token)):
    body = await request.json()
    pdf_url = body.get("document_url")
    
    if not pdf_url:
        raise HTTPException(status_code=422, detail="Missing required field: 'document_url'")
        
    session_id = str(uuid.uuid4())
    unique_pdf_name = f"{session_id}.pdf"
    pdf_path = os.path.join(PARSED_TEXT_OUTPUT_FOLDER, unique_pdf_name)
    
    try:
        await download_pdf_from_url(pdf_url, pdf_path)
        all_chunks = parse_and_chunk_pdf(pdf_path)
        chunk_contents = [chunk["content"] for chunk in all_chunks]
        embeddings = embedding_model.encode(chunk_contents, show_progress_bar=False)
        embeddings = np.array(embeddings).astype("float32")
        faiss_index = faiss.IndexFlatL2(embeddings.shape[1])
        faiss_index.add(embeddings)

        processed_documents_cache[session_id] = {
            "faiss_index": faiss_index,
            "chunks": all_chunks
        }
        
    except Exception as e:
        return {"error": f"Error during processing: {e}"}
    
    return {"message": "Document processed successfully. You can now ask questions.", "session_id": session_id}

# New endpoint for asking questions based on a session ID
@app.post("/ask_question")
async def ask_question_api(request: Request, token: str = Depends(verify_token)):
    body = await request.json()
    session_id = body.get("session_id")
    question = body.get("question")
    
    if not session_id or not question:
        raise HTTPException(status_code=422, detail="Missing required fields: 'session_id' or 'question'")
    
    if session_id not in processed_documents_cache:
        raise HTTPException(status_code=404, detail="Session ID not found. Please process a document first.")
    
    doc_data = processed_documents_cache[session_id]
    faiss_index = doc_data["faiss_index"]
    all_chunks = doc_data["chunks"]
    
    top_chunks = retrieve_top_k(clean_query(question), TOP_K_RETRIEVAL, faiss_index, all_chunks, embedding_model)
    prompt = construct_rag_prompt(question, top_chunks)
    
    try:
        llm_response = await call_llm_api([
            {"role": "system", "content": "You are a helpful insurance assistant."},
            {"role": "user", "content": prompt}
        ])
    except Exception as e:
        return {"error": f"Error answering question: {str(e)}"}
    
    return {"answer": llm_response.strip()}


# Keep your old endpoint for reference or for Postman
@app.post("/hackrx/run")
async def hackrx_run_api(
    request: Request,
    token: str = Depends(verify_token),
):
    body = await request.json()
    pdf_url = body.get("documents")
    questions = body.get("questions", [])
    if not pdf_url or not questions:
        raise HTTPException(status_code=422, detail="Missing required fields: 'documents' or 'questions'")
        
    unique_pdf_name = f"{uuid.uuid4()}.pdf"
    pdf_path = os.path.join(PARSED_TEXT_OUTPUT_FOLDER, unique_pdf_name)
    await download_pdf_from_url(pdf_url, pdf_path)
    
    try:
        all_chunks = parse_and_chunk_pdf(pdf_path)
    except Exception as e:
        return {"error": f"Error parsing PDF: {e}"}
        
    chunk_contents = [chunk["content"] for chunk in all_chunks]
    chunk_metadatas = [chunk["metadata"] for chunk in all_chunks]
    try:
        embeddings = embedding_model.encode(chunk_contents, show_progress_bar=False)
        embeddings = np.array(embeddings).astype("float32")
        faiss_index = faiss.IndexFlatL2(embeddings.shape[1])
        faiss_index.add(embeddings)
    except Exception as e:
        return {"error": f"Error during embedding or FAISS index creation: {e}"}
        
    answers = []
    for question in questions:
        top_chunks = retrieve_top_k(clean_query(question), TOP_K_RETRIEVAL, faiss_index, all_chunks, embedding_model)
        prompt = construct_rag_prompt(question, top_chunks)
        try:
            llm_response = await call_llm_api([
                {"role": "system", "content": "You are a helpful insurance assistant."},
                {"role": "user", "content": prompt}
            ])
            answers.append(llm_response.strip())
        except Exception as e:
            answers.append(f"Error answering question: {str(e)}")
            
    return {"answers": answers}