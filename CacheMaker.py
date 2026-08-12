################# By Nazky  ##############
# This script is kept here for documentation purposes.
# The manifest files are now firmware-based and can be found in the firmware_manifests/ directory.
# The old PSFree.manifest has been removed.

import os
from datetime import datetime

# Configuration
EXCLUDED_DIRS = {'.venv', '.git', 'noneed', '.github', 'node_modules'}
EXCLUDED_EXTENSIONS = {
    '.bat', '.txt', '.exe', '.mp4', '.py', '.bak', '.zip',
    '.mp3', '.sh', '.h', '.c', '.o', '.ld', '.md', '.d', '.json'
}
EXCLUDED_FILES = {'.gitignore', 'COPYING', 'LICENSE', 'MAKEFILE', 'dockerfile', '.gitinclude', '.prettierrc', '.keepgithub'}
OUTPUT_FILE = 'PSFree.manifest'

def create_manifest():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    manifest_path = os.path.join(root_dir, OUTPUT_FILE)
    with open(manifest_path, 'w', encoding='utf-8') as f:
        # Write header
        f.write("CACHE MANIFEST\n")
        f.write(f"# v1\n")
        f.write(f"# Generated on {datetime.now()}\n\n")
        f.write("CACHE:\n")
        # Walk through all files
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Remove excluded directories (modifies the dirnames list in-place)
            dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS]
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                relpath = os.path.relpath(filepath, root_dir)
                # Skip excluded files, extensions and the manifest file itself
                ext = os.path.splitext(filename)[1].lower()
                if (ext in EXCLUDED_EXTENSIONS or
                    filename in EXCLUDED_FILES or
                    filename == OUTPUT_FILE):
                    continue
                # Write relative path to manifest
                f.write(f"{relpath.replace(os.sep, '/')}\n")
        # Write network section
        f.write("\nNETWORK:\n")
        f.write("*\n")

    print(f"Successfully created {OUTPUT_FILE}")
    print(f"Excluded folders: {', '.join(EXCLUDED_DIRS)}")

if __name__ == "__main__":
    create_manifest()