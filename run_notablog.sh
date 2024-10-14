     #!/bin/bash

     # Navigate to the project directory (optional, if not already in the correct directory)
     cd /Users/aliasgerrasheed/Documents/creative-coding/papa-website/docs/ || exit  # Change this to your project directory

     # Run the notablog generation and git commands
     notablog generate . && \
     git add . && \
     CHANGES=$(git status --porcelain | awk '{print $2}' | tr '\n' ', ' | sed 's/,$//' | sed 's/^/Changes in: /') && \
     git commit -m "Auto-commit: $CHANGES" && \
     git push