import sys
import torch
import torch.nn as nn 
from transformers import BertTokenizer, BertModel

class ChatbotModel(nn.Module):
    def __init__(self, inputSize, hiddenSize, outputSize):
        super(ChatbotModel, self).__init__()
        self.bert = BertModel.from_pretrained('bert-base-uncased')
        self.hidden = nn.Linear(768, hiddenSize) # BERT output size is 768
        self.output = nn.Linear(hiddenSize, outputSize)
        self.activation = nn.ReLU()
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

    def forward(self, x):
        outputs = self.bert(**x)
        x = outputs.last_hidden_state[:, 0, :] # Use [CLS] token output
        x = self.hidden(x)
        x = self. activation(x)
        x = self.output(x)
        
        return x
    
def getResponse(userMessage):
    model = ChatbotModel(768, 50, 100) #Adjust input size for matching it with BERT's OUTPUT
    model.eval()

    # token  input
    inputs = model.tokenizer(userMessage, return_tensors='pt', padding=True, truncation=True, max_length=512)

    with torch.no_grad():
        output = model(inputs)

    return f"AI response to: {userMessage}\nOutput: {output.tolist()}"

if __name__ == "__main__":
    userMessage = sys.argv[1]
    response = getResponse(userMessage)
    print(response)
        
    