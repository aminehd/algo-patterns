        
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
        with open(self.external_msgs_file, 'w') as f:
            f.write('')
            
        with open(self.external_msgs_file, 'a') as f:
            for msg in self.code_stack:
                f.write(str( msg ).rstrip() + '\n')
            
            f.write('```python\n')
            for msg in self.external_msgs:
                f.write(str( msg ) + '\n')
                
            f.write('```\n')
        return result

    def do_n(self, arg):
        """Enhanced next command that stays in user code only."""
        os.system('cls' if os.name == 'nt' else 'clear')
        
        def is_library_file(filename):
            """Check if a file is a library file rather than user code."""
            # Avoid lib, site-packages, and Python's own files
            return ('lib' in filename or 
                    'site-packages' in filename or 
                    'python' in filename.lower() or
                    filename.startswith('/usr'))

        current_frame = self.curframe
        frame = self.curframe

        # while frame:
        #     next_line = frame.f_code.co_firstlineno + frame.f_lineno
        #     with open(frame.f_code.co_filename, 'r') as f:
        #         lines = f.readlines()
        #         if next_line < len(lines) and 'print' in lines[next_line - 1]:
        #             return self.do_n(arg)  # Skip print lines recursively
        #     break 
        # If we're in a library file, keep using continue until we get back to user code
        while current_frame and is_library_file(current_frame.f_code.co_filename):
            super().do_c(arg)  # Continue execution
            current_frame = self.curframe
            
        # Get current indentation level
        with open(current_frame.f_code.co_filename, 'r') as f:
            lines = f.readlines()
            current_line = lines[current_frame.f_lineno - 1]
            current_indent = len(current_line) - len(current_line.lstrip())
        
        result = super().do_n(arg)
        with open(self.log_file, 'w') as f:
            f.write('')
        with open(self.log_file, 'a') as f:
            for msg in self.msgs:
                f.write(msg + '\n')
        # After executing, check if we need to keep stepping
        # Execute next
        next_frame = self.curframe
        if next_frame:
            # If we've entered a function or changed files, return from it
            if 'FB_Study' in next_frame.f_code.co_filename : ####COME BACK TO THIS
                return self.do_r(arg)
            
            # Check if indentation has increased (entered a new block)
            with open(next_frame.f_code.co_filename, 'r') as f:
                lines = f.readlines()
                if next_frame.f_lineno <= len(lines):
                    next_line = lines[next_frame.f_lineno - 1]
                    next_indent = len(next_line) - len(next_line.lstrip())
                    if next_indent > current_indent:
                        return self.do_r(arg)
        
        # Write messages to log file
        
        
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
        
        # start = max(0, lineno - self.context)
        # end = min(len(lines), lineno + self.context)
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
                else:
                    self.code_stack.append(f'    {i+1:4d} {line}\n') 
        self.code_stack.append('```\n')
        return f'{Fore.CYAN}> {filename}({lineno}){Style.RESET_ALL}\n{"".join(context)}'


    def logger(self, msg):
        self.external_msgs.append(msg)
    def clean_logger(self):
        self.external_msgs = []

    def do_anim(self, arg):
        os.system('cls' if os.name == 'nt' else 'clear')  # Clear terminal directly
        frame = self.curframe
        while frame:
            filename = frame.f_code.co_filename
            lineno = frame.f_lineno
            function = frame.f_code.co_name
            print(f"{Fore.CYAN}File {filename}, line {lineno}, in {function}{Style.RESET_ALL}")
            time.sleep(0.5)  # Animation delay
            frame = frame.f_back

    def default(self, line):
        # Maintain colors for all commands
        print(f"{Fore.GREEN}Executing: {line}{Style.RESET_ALL}")
        return super().default(line)

# Usage:


pdb = ColorPdb()



a = 10
# pdb.set_trace() ### use this instead of Break point
pdb.logger('msgs')
b = a * 100

    
# /Users/aminehdadsetan/WorkSpace/InterViewPrep/FB_Raw/bin/python /Users/aminehdadsetan/WorkSpace/InterViewPrep/FB_Study/2025_02_08_fb_study.py
# # use ##! to add variables to print


for i in range(492, 5020):
    pdb.set_break(__file__, i)
    
# class ... , type c in cosole debugger and see logs in debug_log.py, later you can push into
# pdb.push_pictures() and see the whole stack in pictrures.py








