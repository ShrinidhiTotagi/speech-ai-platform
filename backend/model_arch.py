import torch.nn as nn

class CNNBiLSTM(nn.Module):
    def __init__(self):
        super().__init__()
        self.cnn = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d((2,2)),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d((2,2)),
        )

        self.lstm = nn.LSTM(
            input_size=64,
            hidden_size=128,
            num_layers=1,
            batch_first=True,
            bidirectional=True
        )

        self.fc = nn.Linear(256, 2)

    def forward(self, x):
        # x: (B, 1, mel_bins, T)
        x = self.cnn(x)           # (B, 64, mel/4, time/4)
        x = x.mean(2)             # (B, 64, T)
        x = x.permute(0, 2, 1)    # (B, T, 64)
        x, _ = self.lstm(x)       # (B, T, 256)
        x = x.mean(1)             # (B, 256)
        return self.fc(x)
