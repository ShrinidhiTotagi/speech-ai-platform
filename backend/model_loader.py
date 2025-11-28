import torch
import torch.nn as nn

class CNNBiLSTM(nn.Module):
    def __init__(self):
        super().__init__()
        self.cnn = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d((2, 2)),

            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d((2, 2)),
        )

        self.lstm = nn.LSTM(
            input_size=64,
            hidden_size=128,
            num_layers=1,
            batch_first=True,
            bidirectional=True,
        )

        self.fc = nn.Linear(256, 2)

    def forward(self, x):
        x = self.cnn(x)
        x = x.mean(2)
        x = x.permute(0, 2, 1)
        x, _ = self.lstm(x)
        x = x.mean(1)
        return self.fc(x)


def load_model_robust(path, device="cpu"):
    try:
        model = CNNBiLSTM().to(device)
        sd = torch.load(path, map_location=device)

        model.load_state_dict(sd, strict=True)
        print("MODEL LOADED SUCCESSFULLY")
        return model
    except Exception as e:
        print("MODEL LOAD FAILED:", e)
        return None
