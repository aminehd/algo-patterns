from typing import List, Tuple, Dict, Optional
import heapq 
import time, os, sys, re
from IPython.core.debugger import set_trace
from colorama import Fore, Style, init
import inspect
from collections import defaultdict, Counter, deque
from pygments import highlight
from pygments.formatters import TerminalFormatter
from pygments.lexers import Python3Lexer
from colorama import Fore, Style, init
import logging
from IPython.core.debugger import Pdb
from IPython.terminal.debugger import TerminalPdb



class ColorPdb(Pdb):  # or just TerminalPdb
    def __init__(self):
        super().__init__()
        self.prompt = f'{Fore.BLUE}(ipdb) {Style.RESET_ALL}'
        self.context = 40  # Number of lines of code to show
        self.msgs = []
        self.external_msgs = []
        self.loop_stack = []
        self.log_file = './debug_log.md'
        self.code_file = './code_log.py' 
        self.code_stack = []
        self.external_msgs_file = './external_debug_log.md'
    def output_log(self):
        code_width = max(len(line) for line in self.code_stack) if self.code_stack else 0
        
        with open(self.external_msgs_file, 'a') as f:
            # Write code and messages side by side
            f.write('```python\n')
            
            # Calculate number of lines needed for vertical centering
            max_lines = max(len(self.code_stack), len(self.external_msgs))
            msg_start = (max_lines - len(self.external_msgs)) // 2
            
            # Add empty lines before messages for centering
            code_lines = self.code_stack + [''] * (max_lines - len(self.code_stack))
            msg_lines = [''] * msg_start + self.external_msgs + [''] * (max_lines - len(self.external_msgs) - msg_start)
            
            for code, msg in zip(code_lines, msg_lines):
                # Pad code section to align messages
                padded_code = str(code).rstrip().ljust(code_width)
                if msg:
                    f.write(f"{padded_code} │ {msg}\n")
                else:
                    f.write(f"{padded_code}\n")
                    
            f.write('```\n')
    def do_c(self, arg):
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"{Fore.GREEN}Continuing...{Style.RESET_ALL}")

        """Enhanced continue command that skips pdb.logger lines"""
        def trace_dispatch(frame, event, arg):
            if event == 'line':
                try:
                    with open(frame.f_code.co_filename, 'r') as f:
                        current_line = f.readlines()[frame.f_lineno - 1]
                        if 'pdb.logger' in current_line:
                            # Skip logger lines
                            return None
                except:
                    pass
                    
                # Normal trace for non-logger lines    
                return self.trace_dispatch(frame, event, arg)
            return self.trace_dispatch(frame, event, arg)
        
        # Store original trace function
        old_trace = sys.gettrace()
        
        # Set our custom trace
        sys.settrace(trace_dispatch)
        
        # Continue execution
        result = super().do_c(arg)
        
        # Restore original trace
        sys.settrace(old_trace)
        # Clear the file first
        with open(self.external_msgs_file, 'w') as f:
            f.write('')
        
        # Calculate max width needed for code section

        return result

 

 
    def set_trace(self, frame=None, start_line=0, end_line=100, context=200, variables=None):
        self.variables = variables if variables is not None else []
        self.start_line = start_line
        self.end_line = end_line
        os.system('cls' if os.name == 'nt' else 'clear')
        # for msg in self.msgs:
        #     print(msg)
        if frame is None:
            frame = sys._getframe().f_back
            
        # Create a new code object with filtered lines
        with open(frame.f_code.co_filename, 'r') as f:
            lines = f.readlines()

        # Change the context of the debugger itself
        self.context = context  # This will make pdb show 10 lines of context
        super().set_trace(frame)
            # First, collect all the code lines to determine max width later
        # Gather code lines and prepare code stack
    def gather_code_lines(self, lines, start, end, lineno):
        code_lines = []
        for i in range(start, end):
            if i >= len(lines):
                break
            line = lines[i].rstrip()
            code_lines.append(line)
            
            # Add to code_stack for later use
            if 'print_state' not in line:
                if i + 1 == lineno or (i + 1 < len(lines) and 'print_state' in lines[i+1] and i + 2 == lineno):
                    self.code_stack.append(f'--> {i+1:4d} {line}\n') #(TODO later : replace marker with 🛑> for breakpoint)
                else:
                    self.code_stack.append(f'    {i+1:4d} {line}\n')
        
        # Calculate max width from the code lines we've collected
        max_code_width = 0
        if code_lines:
            max_code_width = max(len(line) for line in code_lines)
            
        return code_lines, max_code_width
    
    # Format context with code and messages side by side
    def format_context_with_messages(self,lines, start, end, lineno, max_code_width):
        context = []
        for i in range(start, end):
            if i >= len(lines):
                break
            line = lines[i]
            
            # Color keywords without messing up spacing
            colored_line = (line.replace('for ', f'{Fore.MAGENTA}for{Style.RESET_ALL} ')
                                .replace('def ', f'{Fore.MAGENTA}def{Style.RESET_ALL} ')
                                .replace('while ', f'{Fore.MAGENTA}while{Style.RESET_ALL} '))
            
            # Calculate padding needed to align messages
            padding = max(0, max_code_width - len(line.rstrip()) + 4)
            
            # Get corresponding message if available
            msg_idx = i - start
            msg = self.external_msgs[msg_idx] if msg_idx < len(self.external_msgs) else ""
            
            if i + 1 == lineno:
                # Current line
                marker = f'{Fore.CYAN}-->{Style.RESET_ALL}'
                line_num = f'{Fore.GREEN}{i+1:4d}{Style.RESET_ALL}'
                context.append(f'{marker} {line_num} {Fore.YELLOW}{colored_line.rstrip()}{" " * padding}│ {msg}{Style.RESET_ALL}\n')
            else:
                # Other lines 
                marker = f'{Fore.BLUE}   {Style.RESET_ALL}'
                line_num = f'{Fore.WHITE}{i+1:4d}{Style.RESET_ALL}'
                context.append(f'{marker} {line_num} {Fore.LIGHTBLACK_EX}{colored_line.rstrip()}{" " * padding}│ {msg}{Style.RESET_ALL}\n')
        
        return context
    def represent_state(self, frame):
        self.external_msgs = []
        # Get the values of variables from the current frame
        if hasattr(self, 'variables') and self.variables:
            for var_name in self.variables:
                var_value = frame.f_locals.get(var_name, 'not found')
                self.external_msgs.append(f'Current {var_name} value: {var_value}')
        
    def format_stack_entry(self, frame_lineno, prompt_prefix=None, line_prefix=None):
        frame, lineno = frame_lineno
        filename = frame.f_code.co_filename
        self.code_stack = [] 
        self.represent_state(frame)
        with open(filename, 'r') as f:
            lines = f.readlines()
        
        start = self.start_line
        end =  self.end_line

        
        context = []
        code_lines, max_code_width = self.gather_code_lines(lines, start, end, lineno)
        context = self.format_context_with_messages(lines, start, end, lineno, max_code_width)
        return f'{Fore.CYAN}> {filename}({lineno}){Style.RESET_ALL}\n{"".join(context)}'


    def logger(self, msg):
        self.external_msgs.append(msg)
    def clean_logger(self):
        self.external_msgs = []


