use clap::Parser;
use tracing_subscriber::EnvFilter;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Path to the project root
    #[arg(short, long, default_value = ".")]
    path: String,

    /// Enable verbose output
    #[arg(short, long)]
    verbose: bool,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let args = Args::parse();

    // Настройка логирования
    let filter = if args.verbose {
        EnvFilter::new("debug")
    } else {
        EnvFilter::new("info")
    };
    
    tracing_subscriber::fmt().with_env_filter(filter)
        .init();

    tracing::info!("Starting ED linter");
    tracing::info!("Scanning path: {}", args.path);

    // TODO: Добавить основную логику линтера

    Ok(())
} 