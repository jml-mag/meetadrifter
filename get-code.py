import os
import logging
from typing import List, Set

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger()


def initialize_logging():
    """Initializes logging settings for the script."""
    logger.setLevel(logging.DEBUG)
    file_handler = logging.FileHandler('file_operations.log')
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)


class FileFinder:
    """
    A class to search through directories for files with specific extensions
    and to compile their contents.
    """

    def __init__(self, root_path: str, folders_to_search: List[str], output_filename: str, extensions: Set[str]):
        """
        Initializes the FileFinder with necessary parameters.

        :param root_path: The root directory to search in.
        :param folders_to_search: Folders within the root directory to search through.
        :param output_filename: The name of the file where results will be saved.
        :param extensions: A set of file extensions to include in the search.
        """
        self.root_path = root_path
        self.folders_to_search = folders_to_search
        self.output_filename = output_filename
        self.extensions = extensions
        self.all_file_contents = []

    def find_and_append_files(self, folder_path: str):
        """
        Searches for files within the specified folder_path with extensions matching
        those in the extensions set, appending their content to all_file_contents.

        :param folder_path: The path of the folder to search in.
        """
        for root, _, files in os.walk(folder_path):
            for file in files:
                if any(file.endswith(ext) for ext in self.extensions):
                    full_path = os.path.join(root, file)
                    try:
                        with open(full_path, 'r', encoding='utf-8') as f:
                            file_content = f.read()
                            relative_path = full_path.replace(
                                self.root_path, '')[1:]
                            self.all_file_contents.extend([
                                f'File Path: {relative_path}', file_content, '---'
                            ])
                            logger.info(
                                f'Appended content from {relative_path}')
                    except Exception as e:
                        logger.error(f"Error reading {full_path}: {e}")

    def run(self):
        """Executes the search and write operations."""
        for folder in self.folders_to_search:
            folder_path = os.path.join(self.root_path, folder)
            if os.path.exists(folder_path):
                self.find_and_append_files(folder_path)
                logger.info(f'Searched through {folder_path}')
            else:
                logger.warning(f"Folder {folder} does not exist.")

        self.write_to_file()

    def write_to_file(self):
        """Writes the collected file contents to the specified output file."""
        try:
            with open(os.path.join(self.root_path, self.output_filename), 'w', encoding='utf-8') as output_file:
                output_file.write('\n'.join(self.all_file_contents))
            logger.info(
                f"Operation completed. All code written to {self.output_filename}")
        except Exception as e:
            logger.error(f"Failed to write to {self.output_filename}: {e}")


if __name__ == '__main__':
    initialize_logging()
    root_path = os.path.dirname(os.path.abspath(__file__))
    folders_to_search = ['amplify']  # Edit folders as needed
    output_filename = 'current-code.txt'
    extensions = {'.ts', '.tsx', '.js', '.jsx',
                  '.css'}  # Edit extensions as needed

    file_finder = FileFinder(
        root_path, folders_to_search, output_filename, extensions)
    file_finder.run()
