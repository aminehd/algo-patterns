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

def sine_wave_pattern(width, height, time_step, wave_length=10.0, amplitude=3.0):
    """
    Generate a sine wave pattern similar to Bees and Bomb animations.
    Creates a phase-shifted wave pattern that creates visual resonance.
    """
    frame = [[" " for _ in range(width)] for _ in range(height)]
    
    # Different characters for different densities
    chars = " ░▒▓█"
    
    # Generate the pattern
    for x in range(width):
        for y in range(height):
            # Calculate distance from center
            center_x, center_y = width // 2, height // 2
            distance = math.sqrt((x - center_x)**2 + (y - center_y)**2)
            
            # Phase shift based on distance and time
            phase = distance / wave_length + time_step
            
            # Value oscillates between 0 and 1
            value = (math.sin(phase) + 1) / 2
            
            # Choose character based on value
            char_index = min(int(value * len(chars)), len(chars) - 1)
            
            # Apply color based on position and time
            hue = (distance / (width/2) * 180 + time_step * 20) % 360
            
            # Simplified color mapping (6 colors)
            if hue < 60:
                frame[y][x] = Fore.RED + chars[char_index]
            elif hue < 120:
                frame[y][x] = Fore.YELLOW + chars[char_index]
            elif hue < 180:
                frame[y][x] = Fore.GREEN + chars[char_index]
            elif hue < 240:
                frame[y][x] = Fore.CYAN + chars[char_index]
            elif hue < 300:
                frame[y][x] = Fore.BLUE + chars[char_index]
            else:
                frame[y][x] = Fore.MAGENTA + chars[char_index]
                
    return frame

def rotating_circles(width, height, time_step, num_circles=6):
    """
    Generate rotating circles pattern inspired by Bees and Bomb.
    """
    frame = [[" " for _ in range(width)] for _ in range(height)]
    
    # Center of the pattern
    center_x, center_y = width // 2, height // 2
    
    # Maximum radius (slightly smaller than half the minimum dimension)
    max_radius = min(width, height) // 2 - 2
    
    # Draw the circles
    for r in range(max_radius, 0, -max_radius // num_circles):
        # Each circle rotates at a different speed and direction
        angle = time_step * (0.5 - (r / max_radius))
        
        # Calculate points around the circle
        points = []
        num_points = int(2 * math.pi * r / 2)  # Adjust density
        for i in range(num_points):
            theta = 2 * math.pi * i / num_points + angle
            x = int(center_x + r * math.cos(theta))
            y = int(center_y + r * math.sin(theta))
            
            # Ensure point is within bounds
            if 0 <= x < width and 0 <= y < height:
                points.append((x, y))
        
        # Draw the points with appropriate color
        color_index = (r // (max_radius // num_circles)) % 6
        colors = [Fore.RED, Fore.YELLOW, Fore.GREEN, Fore.CYAN, Fore.BLUE, Fore.MAGENTA]
        color = colors[color_index]
        
        for x, y in points:
            frame[y][x] = color + "●"
    
    return frame

def hypnotic_squares(width, height, time_step, num_squares=10):
    """
    Generate animated nested squares with phase shifts.
    """
    frame = [[" " for _ in range(width)] for _ in range(height)]
    
    center_x, center_y = width // 2, height // 2
    max_size = min(width, height) - 2
    
    # Draw nested squares
    for size in range(max_size, 0, -max_size // num_squares):
        # Phase shift based on size and time
        phase = time_step + size * 0.05
        
        # Oscillate the rotation angle
        angle = math.sin(phase) * 0.2
        cos_angle = math.cos(angle)
        sin_angle = math.sin(angle)
        
        # Determine the corners of the square
        half_size = size // 2
        corners = [
            (-half_size, -half_size),
            (half_size, -half_size),
            (half_size, half_size),
            (-half_size, half_size)
        ]
        
        # Rotate the corners
        rotated_corners = []
        for x, y in corners:
            rx = int(x * cos_angle - y * sin_angle)
            ry = int(x * sin_angle + y * cos_angle)
            rotated_corners.append((center_x + rx, center_y + ry))
        
        # Connect the corners with lines
        for i in range(4):
            x1, y1 = rotated_corners[i]
            x2, y2 = rotated_corners[(i + 1) % 4]
            
            # Draw the line using Bresenham's algorithm
            dx = abs(x2 - x1)
            dy = abs(y2 - y1)
            sx = 1 if x1 < x2 else -1
            sy = 1 if y1 < y2 else -1
            err = dx - dy
            
            x, y = x1, y1
            while True:
                if 0 <= x < width and 0 <= y < height:
                    # Color based on size and time
                    color_index = (size // (max_size // num_squares)) % 6
                    colors = [Fore.RED, Fore.YELLOW, Fore.GREEN, Fore.CYAN, Fore.BLUE, Fore.MAGENTA]
                    color = colors[color_index]
                    
                    # Different characters for different squares
                    char = "■" if size % 2 == 0 else "□"
                    frame[y][x] = color + char
                
                if x == x2 and y == y2:
                    break
                    
                e2 = 2 * err
                if e2 > -dy:
                    err -= dy
                    x += sx
                if e2 < dx:
                    err += dx
                    y += sy
    
    return frame

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

def run_animation(pattern_func, width, height, duration=10, fps=15, **kwargs):
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
    width = 80
    height = 24
    
    print("Bees and Bomb-style Animations")
    print("==============================")
    print("Press Ctrl+C to skip to the next animation")
    time.sleep(2)
    
    try:
        print("\nSine Wave Pattern:")
        time.sleep(1)
        run_animation(sine_wave_pattern, width, height, duration=10, wave_length=10.0, amplitude=3.0)
        
        print("\nRotating Circles:")
        time.sleep(1)
        run_animation(rotating_circles, width, height, duration=10, num_circles=8)
        
        print("\nHypnotic Squares:")
        time.sleep(1)
        run_animation(hypnotic_squares, width, height, duration=10, num_squares=12)
        
        print("\nSpinning Galaxy:")
        time.sleep(1)
        run_animation(spinning_galaxy, width, height, duration=10, arms=5)
        
    except KeyboardInterrupt:
        pass
    
    print("\nAnimations completed!")

if __name__ == "__main__":
    main()