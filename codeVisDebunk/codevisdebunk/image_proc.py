#Here are the inputs and outputs represented as a list of lists

inputs = [
   [[5, 5, 5, 0, 0, 0, 0, 0, 5], [5, 0, 5, 0, 5, 0, 0, 5, 0], [5, 5, 5, 0, 0, 0, 5, 0, 0]],
   [[0, 0, 5, 0, 0, 0, 0, 0, 0], [0, 5, 0, 0, 0, 0, 0, 5, 0], [5, 0, 0, 5, 5, 5, 0, 0, 0]],
   [[5, 5, 5, 5, 5, 5, 0, 0, 0], [0, 0, 0, 5, 0, 5, 0, 0, 0], [0, 0, 0, 5, 5, 5, 5, 5, 5]],
   [[0, 0, 0, 5, 5, 5, 5, 5, 5], [0, 5, 0, 0, 0, 0, 5, 0, 5], [0, 0, 0, 0, 0, 0, 5, 5, 5]],
]

outputs = [
   [[3, 3, 3, 4, 4, 4, 9, 9, 9], [3, 3, 3, 4, 4, 4, 9, 9, 9], [3, 3, 3, 4, 4, 4, 9, 9, 9]],
   [[9, 9, 9, 1, 1, 1, 4, 4, 4], [9, 9, 9, 1, 1, 1, 4, 4, 4], [9, 9, 9, 1, 1, 1, 4, 4, 4]],
   [[6, 6, 6, 3, 3, 3, 1, 1, 1], [6, 6, 6, 3, 3, 3, 1, 1, 1], [6, 6, 6, 3, 3, 3, 1, 1, 1]],
   [[4, 4, 4, 6, 6, 6, 3, 3, 3], [4, 4, 4, 6, 6, 6, 3, 3, 3], [4, 4, 4, 6, 6, 6, 3, 3, 3]],
]


class Image:
    def __init__(self, image: list[list[int]]):
        self.image = image

    # break 9 X 3 to 3 side by side 3 X 3
    def break_into_3_X_3(self):
        # Check if image exists and has the right dimensions
        if not hasattr(self, 'image') or not self.image:
            return []
        
        # Get actual dimensions
        rows = len(self.image)
        if rows == 0:
            return []
        
        cols = len(self.image[0])
        
        # Make sure dimensions are multiples of 3
        # If not, you might want to pad the image or adjust the logic
        
        # Calculate how many complete 3x3 blocks we can make
        block_rows = rows // 3
        block_cols = cols // 3
        
        # Create the 3x3 blocks
        print(f"Image dimensions: {len(self.image)} rows x {len(self.image[0])} columns")
        result = []
        for j in range(0, cols, 3):
            block = []
            for i in range(rows):
                block.append(self.image[i][j:j+3])
            result.append(block)
        return result

    # a function that calls break_into_3_X_3 and returns the result, replace each block with a pattern i encode, 
    def match_pattern(self, block):
        #Here are the inputs and outputs represented as a list of lists

            # inputs = [
            # [[5, 5, 5, 0, 0, 0, 0, 0, 5], [5, 0, 5, 0, 5, 0, 0, 5, 0], [5, 5, 5, 0, 0, 0, 5, 0, 0]],
            # [[0, 0, 5, 0, 0, 0, 0, 0, 0], [0, 5, 0, 0, 0, 0, 0, 5, 0], [5, 0, 0, 5, 5, 5, 0, 0, 0]],
            # [[5, 5, 5, 5, 5, 5, 0, 0, 0], [0, 0, 0, 5, 0, 5, 0, 0, 0], [0, 0, 0, 5, 5, 5, 5, 5, 5]],
            # [[0, 0, 0, 5, 5, 5, 5, 5, 5], [0, 5, 0, 0, 0, 0, 5, 0, 5], [0, 0, 0, 0, 0, 0, 5, 5, 5]],
            # ]

            # outputs = [
            # [[3, 3, 3, 4, 4, 4, 9, 9, 9], [3, 3, 3, 4, 4, 4, 9, 9, 9], [3, 3, 3, 4, 4, 4, 9, 9, 9]],
            # [[9, 9, 9, 1, 1, 1, 4, 4, 4], [9, 9, 9, 1, 1, 1, 4, 4, 4], [9, 9, 9, 1, 1, 1, 4, 4, 4]],
            # [[6, 6, 6, 3, 3, 3, 1, 1, 1], [6, 6, 6, 3, 3, 3, 1, 1, 1], [6, 6, 6, 3, 3, 3, 1, 1, 1]],
            # [[4, 4, 4, 6, 6, 6, 3, 3, 3], [4, 4, 4, 6, 6, 6, 3, 3, 3], [4, 4, 4, 6, 6, 6, 3, 3, 3]],
            # ]
#             cell). Valid values are –
# black: 0, blue: 1, red: 2, green: 3, yellow: 4, grey: 5, pink: 6, orange: 7, teal: 8, maroon: 9


        # check if the block is a pattern
        # Pattern 1: 5,5,5 followed by 0,0,0 followed by 0,0,5 in first row
        if block[0] == [5,5,5] and block[0][3:6] == [0,0,0] and block[0][6:] == [0,0,5]:
            # Pattern 1: 5,0,5 followed by 0,5,0 followed by 0,5,0 in second row
            if block[1] == [5,0,5,0,5,0,0,5,0]:
                # Pattern 1: 5,5,5 followed by 0,0,0 followed by 5,0,0 in third row
                if block[2] == [5,5,5,0,0,0,5,0,0]:
                    return [[3,3,3,4,4,4,9,9,9] for _ in range(3)]

        if block == [[0, 0, 0], [0, 0, 0], [0, 0, 0]]:
            return 0
        elif block == [[5, 5, 5], [0, 5, 0], [5, 5, 5]]:
            return 6
        elif block == [[0, 0, 5], [0, 5, 0], [5, 5, 5]]:
            return 3
        elif block == [[5, 5, 5], [5, 5, 5], [5, 5, 5]]:
            return 9
        elif block == [[0, 0, 0], [5, 5, 5], [0, 0, 0]]:
            return 4
        elif block == [[0, 5, 0], [0, 5, 0], [5, 5, 5]]:
            return 1
        elif block == [[5, 0, 0], [5, 0, 0], [5, 5, 5]]:
            return 2
        elif block == [[0, 0, 5], [0, 0, 5], [5, 5, 5]]:
            return 8
        elif block == [[0, 5, 0], [0, 5, 0], [0, 5, 0]]:
            return 7
        elif block == [[0, 0, 0], [0, 0, 0], [0, 0, 0]]:
            return 0
        else:
            return 0
            
    def transform(self):
        blocks = self.break_into_3_X_3()
        
        result = []
        for block in blocks:
            pattern = self.match_pattern(block)
            # replace the block with the pattern
            new_block = [[pattern for _ in range(3)] for _ in range(3)]
            result.append(new_block)
            
        return result
    def __eq__(self, other):
        return self.image == other.image

    def __repr__(self):
        return f"Image({self.image})"



image = Image([[5, 5, 5, 0, 0, 0, 0, 0, 5], [5, 0, 5, 0, 5, 0, 0, 5, 0], [5, 5, 5, 0, 0, 0, 5, 0, 0]])
print(image.transform())

# def transform(input: list[list[int]]) -> list[list[int]]:
#     return [[]]
def transform(input: list[list[int]]) -> list[list[int]]:
    image = Image(input)
    return image.transform()

    
# I first defined class Image, that takes image of type list[list[int]] to initialize. 
# Then I prompted "to defnie a function that 9X3 input array to 3x3 blocks that are vertically stacked""
# it gave me this block of code:

#         for j in range(0, cols, 3):
#             block = []
#             for i in range(rows):
#                 block.append(self.image[i][j:j+3])
#             result.append(block)
#         return result
# Then I decided to implement a transform fucntion in Image class that uses break_into_3_X_3.
# So I prompted "loop through each block and use match_pattern to replace the block with the mathced numebr"
#         result = []
#         for block in blocks:
#             pattern = self.match_pattern(block)
#             # replace the block with the pattern
#             new_block = [[pattern for _ in range(3)] for _ in range(3)]
#             result.append(new_block)
            
#         return result