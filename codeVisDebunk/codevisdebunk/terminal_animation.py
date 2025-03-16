#!/usr/bin/env python3
import time
import os
import random
from colorama import Fore, Back, Style, init

# Initialize colorama
init(autoreset=True)

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def draw_frame(frame):
    """Draw a single frame of the animation."""
    for row in frame:
        line = ""
        for pixel in row:
            if pixel == 0:  # Empty space
                line += "  "
            elif pixel == 1:  # Star
                line += Fore.YELLOW + "* "
            elif pixel == 2:  # Heart
                line += Fore.RED + "♥ "
            elif pixel == 3:  # Block
                line += Back.BLUE + "  " + Style.RESET_ALL
            elif pixel == 4:  # Circle
                line += Fore.GREEN + "● "
            elif pixel == 5:  # Diamond
                line += Fore.CYAN + "◆ "
        print(line)

def create_rain_animation(width=20, height=10, frames=5):
    """Create a simple rain animation."""
    animations = []
    
    # Initialize with empty frame
    base_frame = [[0 for _ in range(width)] for _ in range(height)]
    
    # Create multiple frames
    for f in range(frames):
        frame = [row[:] for row in base_frame]  # Deep copy
        
        # Add raindrops in random positions
        for _ in range(width // 2):
            x = random.randint(0, width - 1)
            y = random.randint(0, height - 1)
            frame[y][x] = 1  # Raindrop
        
        animations.append(frame)
    
    return animations

def create_heart_pulse(width=20, height=10, frames=5):
    """Create a heart that pulses."""
    animations = []
    
    # Heart in different sizes
    heart_sizes = [
        [
            [0, 2, 2, 0, 0, 2, 2, 0],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [0, 2, 2, 2, 2, 2, 2, 0],
            [0, 0, 2, 2, 2, 2, 0, 0],
            [0, 0, 0, 2, 2, 0, 0, 0],
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 2, 0, 0, 2, 2, 0],
            [0, 2, 2, 2, 2, 2, 2, 0],
            [0, 0, 2, 2, 2, 2, 0, 0],
            [0, 0, 0, 2, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ]
    ]
    
    for f in range(frames):
        # Choose heart size based on frame number
        heart = heart_sizes[f % len(heart_sizes)]
        h_height = len(heart)
        h_width = len(heart[0])
        
        # Create empty frame
        frame = [[0 for _ in range(width)] for _ in range(height)]
        
        # Place heart in center
        start_y = (height - h_height) // 2
        start_x = (width - h_width) // 2
        
        for y in range(h_height):
            for x in range(h_width):
                if start_y + y < height and start_x + x < width:
                    frame[start_y + y][start_x + x] = heart[y][x]
        
        animations.append(frame)
    
    return animations

def create_bouncing_ball(width=20, height=10, frames=10):
    """Create a bouncing ball animation."""
    animations = []
    
    # Ball position and direction
    x, y = width // 2, 0
    dx, dy = 1, 1
    
    for _ in range(frames):
        # Create empty frame
        frame = [[0 for _ in range(width)] for _ in range(height)]
        
        # Update ball position
        x += dx
        y += dy
        
        # Bounce off walls
        if x <= 0 or x >= width - 1:
            dx = -dx
        if y <= 0 or y >= height - 1:
            dy = -dy
        
        # Keep ball in bounds
        x = max(0, min(width - 1, x))
        y = max(0, min(height - 1, y))
        
        # Draw ball
        frame[y][x] = 5  # Ball
        
        animations.append(frame)
    
    return animations

def run_animation(animations, delay=0.2, loops=3):
    """Run the animation for a specified number of loops."""
    for _ in range(loops):
        for frame in animations:
            clear_screen()
            draw_frame(frame)
            time.sleep(delay)

def main():
    print("Terminal Animation Examples")
    print("==========================")
    time.sleep(1)
    
    # Example 1: Rain animation
    print("Rain Animation:")
    time.sleep(1)
    rain_frames = create_rain_animation(width=15, height=8, frames=8)
    run_animation(rain_frames, delay=0.15)
    
    # Example 2: Heart pulse
    print("Heart Pulse Animation:")
    time.sleep(1)
    heart_frames = create_heart_pulse(width=15, height=8, frames=6)
    run_animation(heart_frames, delay=0.3)
    
    # Example 3: Bouncing ball
    print("Bouncing Ball Animation:")
    time.sleep(1)
    ball_frames = create_bouncing_ball(width=15, height=8, frames=15)
    run_animation(ball_frames, delay=0.1)
    
    print("\nAll animations completed!")

if __name__ == "__main__":
    main()