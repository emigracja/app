import os

import pandas as pd
from dotenv import load_dotenv

load_dotenv()

# --- Configuration ---
INPUT_FILE = os.getenv('INPUT_FILE')
OUTPUT_BY_LLM = os.getenv('OUTPUT_BY_LLM')
OUTPUT_BY_VARIANT = os.getenv('OUTPUT_BY_VARIANT')

AGGREGATION_COLS = {
    'input_tokens_used': 'mean',
    'output_tokens_used': 'mean',
    'cached_tokens': 'mean',
    'thinking_tokens': 'mean',
    'cost': 'mean',
    'correct_cases': 'mean',
    'accuracy': 'mean',
    'time_ms': 'mean',
}

print(f"Reading data from '{INPUT_FILE}'...")
try:
    # Read the original CSV file into a pandas DataFrame
    df = pd.read_csv(INPUT_FILE)

    # Ensure numeric columns are treated as numbers, coercing errors to NaN
    numeric_cols = list(AGGREGATION_COLS.keys())
    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce')

except FileNotFoundError:
    print(f"Error: The file '{INPUT_FILE}' was not found.")
    exit()


print(f"Processing summary by LLM identifier...")
summary_llm = df.groupby('llm_identifier').agg(AGGREGATION_COLS).reset_index()
summary_llm.to_csv(OUTPUT_BY_LLM, index=False, float_format='%.6f')
summary_llm = summary_llm.sort_values(by='cost', ascending=True)
print(f"Successfully created '{OUTPUT_BY_LLM}'")


print(f"\nProcessing summary by variant...")
summary_variant = df.groupby('news_impact_variant').agg(AGGREGATION_COLS).reset_index()
summary_variant.to_csv(OUTPUT_BY_VARIANT, index=False, float_format='%.6f')
summary_variant = summary_variant.sort_values(by='cost', ascending=True)
print(f"Successfully created '{OUTPUT_BY_VARIANT}'")

print("\nPreprocessing complete!")
