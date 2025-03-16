#!/usr/bin/env python3
import time
import os
import math
from colorama import Fore, Back, Style, init

# Initialize colorama
init(autoreset=True)

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def spinning_galaxy(width, height, time_step, arms=5):
    """
    Create a spiral galaxy animation with rotating arms.
    """
    frame = [[" " for _ in range(width)] for _ in range(height)]
    
    center_x, center_y = width // 2, height // 2
    max_radius = min(width, height) // 2 - 2
    
    # Base angle for the arms rotation
    base_angle = time_step * 0.2
    
    # Draw the galaxy arms
    for arm in range(arms):
        arm_angle = 2 * math.pi * arm / arms
        
        # Each arm is a logarithmic spiral
        for t in range(0, 100, 2):  # Parameter along the spiral
            # Logarithmic spiral formula
            radius = max_radius * math.exp(-0.1 * t / 100) * (t / 100)
            angle = arm_angle + base_angle + t * 0.15
            
            x = int(center_x + radius * math.cos(angle))
            y = int(center_y + radius * math.sin(angle))
            
            if 0 <= x < width and 0 <= y < height:
                # Color varies along the arm
                colors = [Fore.WHITE, Fore.BLUE, Fore.CYAN, Fore.GREEN, Fore.YELLOW, Fore.RED]
                color_index = int((t / 100) * (len(colors) - 1))
                color = colors[color_index]
                
                # Character based on position (density decreases with radius)
                char_options = ["★", "✧", "·", ".", " "]
                char_index = min(int((t / 100) * len(char_options)), len(char_options) - 1)
                char = char_options[char_index]
                
                frame[y][x] = color + char
    
    # Add a bright center
    if 0 <= center_x < width and 0 <= center_y < height:
        frame[center_y][center_x] = Fore.WHITE + "★"
        
        # Add some more stars around the center
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0), (1, 1), (-1, -1), (1, -1), (-1, 1)]:
            x, y = center_x + dx, center_y + dy
            if 0 <= x < width and 0 <= y < height:
                frame[y][x] = Fore.WHITE + "✧"
    
    return frame

def draw_frame(frame):
    """Draw a single frame of the animation."""
    for row in frame:
        print(''.join(row))

def run_animation(pattern_func, width, height, duration=5, fps=10, **kwargs):
    """Run an animation with the given pattern function."""
    # Calculate number of frames based on duration and fps
    num_frames = duration * fps
    
    try:
        for i in range(num_frames):
            clear_screen()
            time_step = i / fps
            frame = pattern_func(width, height, time_step, **kwargs)
            draw_frame(frame)
            time.sleep(1 / fps)
    except KeyboardInterrupt:
        # Allow clean exit with Ctrl+C
        pass

def main():
    # Use fixed size for terminal animations
    width = 60
    height = 20
    
    print("Spinning Galaxy Animation")
    print("========================")
    print("Press Ctrl+C to exit")
    time.sleep(1)
    
    try:
        run_animation(spinning_galaxy, width, height, duration=5, arms=5)
    except KeyboardInterrupt:
        pass
    
    print("\nAnimation completed!")

if __name__ == "__main__":
    main()