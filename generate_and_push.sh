#!/bin/bash

# Define the path to your repository and the file or folder to check
repo_path="/Users/aliasgerrasheed/Documents/creative-coding/papa-website"
file_or_folder_to_check="config.json"  # You can replace this with "themes" or any other file/folder

# Navigate to the repository
cd "$repo_path" || exit

# Check if the file or folder has changes
if git diff --name-only "$file_or_folder_to_check" | grep -q "$file_or_folder_to_check"; then
    echo "$file_or_folder_to_check has changed. Generating the site with Notablog..."

    # Run the notablog generate command
    notablog generate .

    # Add changes to git
    git add .

    # Commit changes
    git commit -m "Update generated site"

    # Push changes to the remote repository
    git push

    echo "Site generated and changes pushed successfully!"
else
    echo "No changes detected in $file_or_folder_to_check. Nothing to do."
fi