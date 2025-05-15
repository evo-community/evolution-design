use thiserror::Error;

#[derive(Error, Debug)]
pub enum LinterError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Invalid configuration: {0}")]
    Config(String),
}

pub struct Linter {
    path: String,
}

impl Linter {
    pub fn new(path: String) -> Self {
        Self { path }
    }

    pub async fn run(&self) -> Result<(), LinterError> {
        tracing::info!("Running linter on path: {}", self.path);
        
        // Проверяем существование директории
        if !std::path::Path::new(&self.path).exists() {
            return Err(LinterError::Io(std::io::Error::new(
                std::io::ErrorKind::NotFound,
                format!("Directory not found: {}", self.path)
            )));
        }

        // TODO: Реализовать основную логику проверки
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;
    use std::fs;

    #[tokio::test]
    async fn test_linter_creation() {
        let linter = Linter::new("test_path".to_string());
        assert_eq!(linter.path, "test_path");
    }

    #[tokio::test]
    async fn test_linter_run_on_empty_dir() {
        let temp_dir = TempDir::new().unwrap();
        let linter = Linter::new(temp_dir.path().to_str().unwrap().to_string());
        
        // Проверяем, что линтер успешно запускается на пустой директории
        assert!(linter.run().await.is_ok());
    }

    #[tokio::test]
    async fn test_linter_run_on_nonexistent_dir() {
        let linter = Linter::new("/nonexistent/path".to_string());
        
        // Проверяем, что линтер возвращает ошибку для несуществующей директории
        assert!(linter.run().await.is_err());
    }

    #[tokio::test]
    async fn test_linter_run_with_test_files() {
        let temp_dir = TempDir::new().unwrap();
        let test_file_path = temp_dir.path().join("test.txt");
        
        // Создаем тестовый файл
        fs::write(&test_file_path, "test content").unwrap();
        
        let linter = Linter::new(temp_dir.path().to_str().unwrap().to_string());
        
        // Проверяем, что линтер успешно запускается на директории с файлами
        assert!(linter.run().await.is_ok());
    }
} 