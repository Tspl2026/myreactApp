import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 14;
const INITIAL_SNAKE = [
  { x: 7, y: 7 },
  { x: 6, y: 7 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 170;

function getRandomFood(snake) {
  while (true) {
    const food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    const isOnSnake = snake.some(
      (segment) => segment.x === food.x && segment.y === food.y
    );

    if (!isOnSnake) return food;
  }
}

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  const touchStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const startGame = () => {
    const freshSnake = [...INITIAL_SNAKE];
    setSnake(freshSnake);
    setFood(getRandomFood(freshSnake));
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const changeDirection = (newDirection) => {
    const current = directionRef.current;

    const isOpposite =
      current.x + newDirection.x === 0 &&
      current.y + newDirection.y === 0;

    if (isOpposite) return;

    setDirection(newDirection);
    directionRef.current = newDirection;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") changeDirection({ x: 0, y: -1 });
      if (e.key === "ArrowDown") changeDirection({ x: 0, y: 1 });
      if (e.key === "ArrowLeft") changeDirection({ x: -1, y: 0 });
      if (e.key === "ArrowRight") changeDirection({ x: 1, y: 0 });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const move = directionRef.current;

        const newHead = {
          x: head.x + move.x,
          y: head.y + move.y,
        };

        const hitWall =
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y >= GRID_SIZE;

        const hitSelf = prevSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y
        );

        if (hitWall || hitSelf) {
          setIsPlaying(false);
          setGameOver(true);
          return prevSnake;
        }

        const ateFood = newHead.x === food.x && newHead.y === food.y;
        const newSnake = [newHead, ...prevSnake];

        if (ateFood) {
          setScore((prev) => prev + 1);
          setFood(getRandomFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(interval);
  }, [isPlaying, food]);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    const minSwipeDistance = 25;

    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) changeDirection({ x: 1, y: 0 });
      else changeDirection({ x: -1, y: 0 });
    } else {
      if (dy > 0) changeDirection({ x: 0, y: 1 });
      else changeDirection({ x: 0, y: -1 });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.appCard}>
        <h1 style={styles.title}>Snake Game</h1>
        <p style={styles.subTitle}>Swipe or use touch controls</p>

        <div style={styles.topBar}>
          <div style={styles.scoreCard}>
            <span style={styles.scoreLabel}>Score</span>
            <span style={styles.scoreValue}>{score}</span>
          </div>

          <button style={styles.startButton} onClick={startGame}>
            {gameOver ? "Play Again" : isPlaying ? "Restart" : "Start"}
          </button>
        </div>

        <div
          style={styles.board}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            const isSnake = snake.some(
              (segment) => segment.x === x && segment.y === y
            );
            const isHead = snake[0]?.x === x && snake[0]?.y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                style={{
                  ...styles.cell,
                  ...(isSnake ? styles.snakeCell : {}),
                  ...(isHead ? styles.snakeHead : {}),
                  ...(isFood ? styles.foodCell : {}),
                }}
              />
            );
          })}

          {!isPlaying && !gameOver && (
            <div style={styles.overlay}>
              <div style={styles.overlayCard}>
                <h2 style={styles.overlayTitle}>Ready?</h2>
                <p style={styles.overlayText}>Tap Start and swipe to move</p>
              </div>
            </div>
          )}

          {gameOver && (
            <div style={styles.overlay}>
              <div style={styles.overlayCard}>
                <h2 style={styles.overlayTitle}>Game Over</h2>
                <p style={styles.overlayText}>Your Score: {score}</p>
              </div>
            </div>
          )}
        </div>

        <div style={styles.controls}>
          <button
            style={styles.controlButton}
            onClick={() => changeDirection({ x: 0, y: -1 })}
          >
            ↑
          </button>

          <div style={styles.middleControls}>
            <button
              style={styles.controlButton}
              onClick={() => changeDirection({ x: -1, y: 0 })}
            >
              ←
            </button>

            <button
              style={styles.controlButton}
              onClick={() => changeDirection({ x: 1, y: 0 })}
            >
              →
            </button>
          </div>

          <button
            style={styles.controlButton}
            onClick={() => changeDirection({ x: 0, y: 1 })}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  appCard: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "16px",
    boxSizing: "border-box",
    boxShadow: "0 14px 30px rgba(0,0,0,0.25)",
  },
  title: {
    margin: 0,
    textAlign: "center",
    fontSize: "28px",
    color: "#0f172a",
  },
  subTitle: {
    marginTop: "6px",
    marginBottom: "14px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },
  topBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "14px",
    alignItems: "center",
  },
  scoreCard: {
    flex: 1,
    background: "#dbeafe",
    borderRadius: "14px",
    padding: "10px",
    textAlign: "center",
  },
  scoreLabel: {
    display: "block",
    fontSize: "12px",
    color: "#475569",
  },
  scoreValue: {
    display: "block",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1d4ed8",
    marginTop: "2px",
  },
  startButton: {
    flex: 1,
    border: "none",
    background: "#16a34a",
    color: "#fff",
    borderRadius: "14px",
    padding: "14px 12px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    touchAction: "manipulation",
  },
  board: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    display: "grid",
    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
    gap: "3px",
    background: "#94a3b8",
    padding: "4px",
    borderRadius: "18px",
    boxSizing: "border-box",
    overflow: "hidden",
    touchAction: "none",
  },
  cell: {
    background: "#f8fafc",
    borderRadius: "5px",
  },
  snakeCell: {
    background: "#22c55e",
  },
  snakeHead: {
    background: "#15803d",
  },
  foodCell: {
    background: "#ef4444",
    borderRadius: "999px",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(15, 23, 42, 0.35)",
  },
  overlayCard: {
    background: "#fff",
    padding: "18px 20px",
    borderRadius: "16px",
    textAlign: "center",
    width: "80%",
  },
  overlayTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#0f172a",
  },
  overlayText: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#475569",
    fontSize: "14px",
  },
  controls: {
    marginTop: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  middleControls: {
    display: "flex",
    gap: "70px",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  controlButton: {
    width: "72px",
    height: "72px",
    border: "none",
    borderRadius: "20px",
    background: "#2563eb",
    color: "#fff",
    fontSize: "30px",
    fontWeight: "bold",
    cursor: "pointer",
    touchAction: "manipulation",
    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.3)",
  },
};

export default App;