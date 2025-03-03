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
        return result

 

 
    def set_trace(self,  frame=None, start_line = 0, end_line = 100,  context=200):
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

    def format_stack_entry(self, frame_lineno, prompt_prefix=None, line_prefix=None):
        frame, lineno = frame_lineno
        filename = frame.f_code.co_filename
        self.code_stack = [] 
        with open(filename, 'r') as f:
            lines = f.readlines()
        
        start = self.start_line
        end =  self.end_line
        def get_indentation(line):
            return len(line) - len(line.lstrip())
        
        context = []
        self.code_stack.append('```python\n')
        for i in range(start, end):
            
            line = lines[i].rstrip()
            stripped_line = line.lstrip()
            indent = get_indentation(line)

            if i + 1 == lineno:  # This is the current line being executed
                if stripped_line.startswith(('while ', 'for ')):
                    self.indent_level = indent // 4
                    header = '│   ' * self.indent_level + '┌────────────────────────────'
                    self.msgs.append(header)
                    self.msgs.append('│   ' * self.indent_level + '│ 🔍 Loop Start')
                    self.loop_stack.append(indent)


                elif self.loop_stack and indent <= self.loop_stack[-1]:
                    footer = '│   ' * (self.loop_stack[-1] // 4) + '└────────────────────────────'
                    self.msgs.append(footer)
                    self.loop_stack.pop()

                if '##!' in stripped_line:   
                    self.indent_level = indent // 4
                    # parse the comment, get a list of variables, and add them to f'{}' 
                    vars = stripped_line.split('##!')
                    vars = vars[1].strip()
                    vars = vars.split(',')
                    # vars = vars[0]
                    eva = lambda v : eval(v, frame.f_globals, frame.f_locals)
                    a = [f"📌 {var} = {eva(var)}" for var in vars]
                    self.msgs.append('│   ' * self.indent_level + '│ 🔍 ' + ' '.join(a))
            line = lines[i]

            if 'pdb.logger' not in line and 'print_state' not in line:
                # Color keywords without messing up spacing
                colored_line = (line.replace('for ', f'{Fore.MAGENTA}for{Style.RESET_ALL} ')
                                  .replace('def ', f'{Fore.MAGENTA}def{Style.RESET_ALL} ')
                                  .replace('while ', f'{Fore.MAGENTA}while{Style.RESET_ALL} '))
                
                if i + 1 == lineno:
                    # Current line
                    marker = f'{Fore.CYAN}-->{Style.RESET_ALL}'
                    line_num = f'{Fore.GREEN}{i+1:4d}{Style.RESET_ALL}'
                    context.append(f'{marker} {line_num} {Fore.YELLOW}{colored_line}{Style.RESET_ALL}')
                else:
                    # Other lines
                    marker = f'{Fore.BLUE}   {Style.RESET_ALL}'
                    line_num = f'{Fore.WHITE}{i+1:4d}{Style.RESET_ALL}'
                    context.append(f'{marker} {line_num} {Fore.LIGHTBLACK_EX}{colored_line}{Style.RESET_ALL}')
                if i + 1 == lineno:
                    self.code_stack.append(f'--> {i+1:4d} {line}\n')
                    # self.code_stack.append(f'🛑> {i+1:4d} {line}\n')
                    # self.code_stack.append(f'🛑 {i+1:4d} {line}\n')

                else:
                    self.code_stack.append(f'    {i+1:4d} {line}\n') 
        self.code_stack.append('```\n')
        return f'{Fore.CYAN}> {filename}({lineno}){Style.RESET_ALL}\n{"".join(context)}'


    def logger(self, msg):
        self.external_msgs.append(msg)
    def clean_logger(self):
        self.external_msgs = []


