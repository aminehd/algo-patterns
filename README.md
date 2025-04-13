# Algorithm Interview Patterns

A comprehensive guide to common algorithm interview patterns with detailed explanations and solutions.

## Running with Docker

For the easiest setup, you can use Docker to run both the backend and frontend:

```bash
# Start both backend and frontend
docker-compose up

# Rebuild containers if needed
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

- Backend API will be available at: http://localhost:83
- Frontend will be available at: http://localhost:84

## Running Manually

### Backend
```bash
cd backend
poetry install
poetry run python app.py
```

## Patterns Covered
- Two Pointers
- [More patterns coming soon]

## Project Structure
- `patterns/`: Contains all algorithm patterns
- `website/`: Website source code
- `CONTRIBUTING.md`: Guidelines for contributors
- `LICENSE`: MIT License

## Getting Started
1. Clone the repository
2. Navigate to specific pattern
3. Review the README for pattern explanation
4. Check problems and solutions

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on contributing to this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
