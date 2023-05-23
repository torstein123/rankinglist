import pandas as pd
import glob

csv_files = glob.glob('badmintonlista/badmintonportalen_v2/viktig/rankings_*.csv')

# Create an empty list to store the DataFrames
dfs = []

# Iterate over the CSV files
for file in csv_files:
    # Read the CSV file into a DataFrame
    df = pd.read_csv(file)
    
    # Append the DataFrame to the list
    dfs.append(df)

# Concatenate the DataFrames in the list
combined_data = pd.concat(dfs, ignore_index=True)

# Convert "Poeng" column to numeric data type
combined_data['Poeng'] = pd.to_numeric(combined_data['Poeng'], errors='coerce')

# Split "Navn" column into temporary columns
temp = combined_data['Navn'].str.split(', ', expand=True)

# Assign temporary columns to desired columns
combined_data['Navn'] = temp[0]
combined_data['Klubb'] = temp[1]

# Group the data by name and sum their points
combined_data = combined_data.groupby(['Spiller-Id', 'Navn', 'Klubb'], as_index=False)['Poeng'].sum()

# Sort the data by points in descending order
combined_data = combined_data.sort_values('Poeng', ascending=False)

# Reset index to create the ranking column
combined_data.reset_index(drop=True, inplace=True)

# Make the new index column start from 1 instead of 0 for ranking
combined_data.index = combined_data.index + 1

# Save the combined data to a CSV file
combined_data.to_csv('badmintonlista/badmintonportalen_v2/src/combined_rankings.csv', index=True, index_label='Rangering')
