#!/usr/bin/env python3
import time
import os
import math
from colorama import Fore, Back, Style, init
import bees_and_bomb as bab
import terminal_animation as ta

# Initialize colorama
init(autoreset=True)

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def resize_frame(frame, new_width, new_height):
    """Resize a frame to the given dimensions."""
    # Handle empty frame case
    if not frame or not frame[0]:
        return [[" " for _ in range(new_width)] for _ in range(new_height)]
    
    original_height = len(frame)
    original_width = len(frame[0]) if original_height > 0 else 0
    
    # If no resizing needed, return original
    if original_width == new_width and original_height == new_height:
        return frame
    
    # Create a new frame with the target dimensions
    new_frame = []
    
    # Calculate scale factors
    scale_x = original_width / new_width if original_width > 0 and new_width > 0 else 1
    scale_y = original_height / new_height if original_height > 0 and new_height > 0 else 1
    
    # Fill the new frame
    for y in range(new_height):
        new_row = []
        for x in range(new_width):
            # Map coordinates to original frame
            orig_y = min(int(y * scale_y), original_height - 1) if original_height > 0 else 0
            orig_x = min(int(x * scale_x), original_width - 1) if original_width > 0 else 0
            
            # Copy the content if in bounds
            if 0 <= orig_y < original_height and 0 <= orig_x < original_width:
                new_row.append(frame[orig_y][orig_x])
            else:
                new_row.append(" ")  # Fill empty space
        new_frame.append(new_row)
    
    return new_frame

def create_framed_animation(animation_frames, frame_width, frame_height, title=None, border_char='#'):
    """Add a decorative frame around an animation."""
    framed_animation = []
    
    # Calculate the inner dimensions
    inner_width = frame_width - 4  # Account for borders and padding
    inner_height = frame_height - 4  # Account for borders, title, and padding
    
    for frame in animation_frames:
        # Resize the content to fit inside the frame
        resized_content = resize_frame(frame, inner_width, inner_height)
        
        # Create new framed frame
        framed_frame = []
        
        # Top border
        top_border = border_char * frame_width
        framed_frame.append(list(top_border))
        
        # Title row (if provided)
        if title:
            title_text = f" {title} "
            padding = (frame_width - len(title_text)) // 2
            title_row = border_char + " " * padding + title_text
            title_row += " " * (frame_width - len(title_row) - 1) + border_char
            framed_frame.append(list(title_row))
        else:
            framed_frame.append([border_char] + [" "] * (frame_width - 2) + [border_char])
        
        # Empty row beneath title
        framed_frame.append([border_char] + [" "] * (frame_width - 2) + [border_char])
        
        # Content rows
        for row in resized_content:
            content_row = [border_char, " "] + row + [" ", border_char]
            # Ensure row is exactly frame_width long
            if len(content_row) < frame_width:
                content_row.extend([" "] * (frame_width - len(content_row)))
            framed_frame.append(content_row[:frame_width])
        
        # Add empty space if content is shorter than frame
        for _ in range(inner_height - len(resized_content)):
            framed_frame.append([border_char] + [" "] * (frame_width - 2) + [border_char])
        
        # Bottom border
        bottom_border = border_char * frame_width
        framed_frame.append(list(bottom_border))
        
        framed_animation.append(framed_frame)
    
    return framed_animation

def combine_frames_horizontally(frames_list):
    """Combine multiple frames horizontally into a single frame."""
    if not frames_list:
        return []
    
    # Find the maximum height across all frames
    max_height = max(len(frame) for frame in frames_list)
    
    # Create a new combined frame
    combined_frame = []
    for y in range(max_height):
        combined_row = []
        for frame in frames_list:
            # Get this row from the current frame, or use empty space if out of bounds
            row = frame[y] if y < len(frame) else [" "] * len(frame[0]) if frame else []
            combined_row.extend(row)
        combined_frame.append(combined_row)
    
    return combined_frame

def draw_frame(frame):
    """Draw a single frame of the animation."""
    for row in frame:
        print(''.join(row))

def convert_integers_to_strings(frame):
    """Convert any integer values in the frame to strings."""
    if not frame:
        return frame
        
    new_frame = []
    for row in frame:
        new_row = []
        for pixel in row:
            if isinstance(pixel, int):
                # Convert integers to appropriate characters
                if pixel == 0:
                    new_row.append(" ")
                elif pixel == 1:
                    new_row.append(Fore.YELLOW + "*")
                elif pixel == 2:
                    new_row.append(Fore.RED + "♥")
                elif pixel == 3:
                    new_row.append(Back.BLUE + " " + Style.RESET_ALL)
                elif pixel == 4:
                    new_row.append(Fore.GREEN + "●")
                elif pixel == 5:
                    new_row.append(Fore.CYAN + "◆")
                else:
                    new_row.append(str(pixel))
            else:
                new_row.append(pixel)
        new_frame.append(new_row)
    return new_frame

def run_multiple_animations(animations_list, titles=None, duration=10, fps=10):
    """Run multiple animations in sync within frames.
    
    Args:
        animations_list: List of lists of animation frames
        titles: List of titles for each animation (optional)
        duration: Duration in seconds
        fps: Frames per second
    """
    # Ensure titles list matches animations list
    if titles is None:
        titles = [f"Animation {i+1}" for i in range(len(animations_list))]
    elif len(titles) < len(animations_list):
        titles.extend([f"Animation {i+1}" for i in range(len(titles), len(animations_list))])
    
    # Calculate number of frames based on duration and fps
    num_frames = int(duration * fps)
    
    # Calculate frame dimensions for each animation
    num_animations = len(animations_list)
    terminal_width = 80  # Assuming 80 column terminal
    frame_width = terminal_width // num_animations
    frame_height = 20  # Reasonable height for terminal
    
    try:
        for i in range(num_frames):
            clear_screen()
            
            # Get the current frame from each animation (cycling if needed)
            current_frames = []
            for j, animation in enumerate(animations_list):
                if animation:  # Check if animation has frames
                    frame_index = i % len(animation)
                    frame = animation[frame_index]
                    
                    # Convert any integers to strings
                    frame = convert_integers_to_strings(frame)
                    
                    framed = create_framed_animation([frame], frame_width, frame_height, titles[j])[0]
                    current_frames.append(framed)
            
            # Combine frames horizontally
            combined_frame = combine_frames_horizontally(current_frames)
            
            # Draw the combined frame
            draw_frame(combined_frame)
            
            time.sleep(1 / fps)
    except KeyboardInterrupt:
        # Allow clean exit with Ctrl+C
        pass

def get_bees_bomb_animations(width=40, height=15, duration=5, fps=10):
    """Get animations from the bees_and_bomb module."""
    animations = []
    
    # Calculate number of frames
    num_frames = duration * fps
    
    # Ensure minimum dimensions to avoid division by zero errors
    min_width = max(10, width)
    min_height = max(10, height)
    
    # Sine wave animation
    sine_frames = []
    for i in range(num_frames):
        time_step = i / fps
        frame = bab.sine_wave_pattern(min_width, min_height, time_step, wave_length=8.0)
        sine_frames.append(frame)
    animations.append(sine_frames)
    
    # Rotating circles animation
    circle_frames = []
    for i in range(num_frames):
        time_step = i / fps
        # Ensure at least 2 circles to avoid division by zero
        frame = bab.rotating_circles(min_width, min_height, time_step, num_circles=max(2, min(6, min(min_width, min_height) // 4)))
        circle_frames.append(frame)
    animations.append(circle_frames)
    
    # Hypnotic squares animation
    square_frames = []
    for i in range(num_frames):
        time_step = i / fps
        # Ensure at least 2 squares to avoid division by zero
        frame = bab.hypnotic_squares(min_width, min_height, time_step, num_squares=max(2, min(8, min(min_width, min_height) // 4)))
        square_frames.append(frame)
    animations.append(square_frames)
    
    # Spinning galaxy animation
    galaxy_frames = []
    for i in range(num_frames):
        time_step = i / fps
        frame = bab.spinning_galaxy(min_width, min_height, time_step, arms=3)
        galaxy_frames.append(frame)
    animations.append(galaxy_frames)
    
    return animations

def get_terminal_animations(width=40, height=15):
    """Get animations from the terminal_animation module."""
    animations = []
    
    # Rain animation
    rain_frames = ta.create_rain_animation(width=width, height=height, frames=8)
    animations.append(rain_frames)
    
    # Heart pulse animation
    heart_frames = ta.create_heart_pulse(width=width, height=height, frames=6)
    animations.append(heart_frames)
    
    # Bouncing ball animation
    ball_frames = ta.create_bouncing_ball(width=width, height=height, frames=15)
    animations.append(ball_frames)
    
    return animations

def main():
    print("Animation Frame Runner")
    print("=====================")
    time.sleep(1)
    
    # Showcase different combinations of animations
    
    # Example 1: Run all bees_and_bomb animations in sync
    print("\nBees and Bomb Animations:")
    time.sleep(1)
    bab_animations = get_bees_bomb_animations(width=25, height=15, duration=3, fps=8)
    bab_titles = ["Sine Wave", "Rotating Circles", "Hypnotic Squares", "Spinning Galaxy"]
    run_multiple_animations(bab_animations[:2], bab_titles[:2], duration=8, fps=8)  # Only run 2 animations at first
    
    # Example 2: Run all terminal animations in sync
    print("\nTerminal Animations:")
    time.sleep(1)
    terminal_animations = get_terminal_animations(width=25, height=15)
    terminal_titles = ["Rain", "Heart Pulse", "Bouncing Ball"]
    run_multiple_animations(terminal_animations, terminal_titles, duration=8, fps=5)
    
    # Example 3: Mix of both animation types
    print("\nMixed Animations:")
    time.sleep(1)
    mixed_animations = [bab_animations[0], terminal_animations[0]]
    mixed_titles = ["Sine Wave", "Rain"]
    run_multiple_animations(mixed_animations, mixed_titles, duration=8, fps=5)
    
    print("\nAll animation showcases completed!")

if __name__ == "__main__":
    main()