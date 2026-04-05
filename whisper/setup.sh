#!/bin/bash
# Setup local Whisper server for speech-to-text
# This uses faster-whisper-server which provides an OpenAI-compatible API

set -e

echo "Installing faster-whisper-server..."
pip install faster-whisper-server

echo ""
echo "Starting Whisper server on port 8000..."
echo "First run will download the 'tiny' model (~75MB)"
echo ""

# Use tiny model for speed on CPU. Options: tiny, base, small, medium, large-v3
# tiny is fastest, good enough for short voice commands
export WHISPER__MODEL=tiny
export WHISPER__INFERENCE_DEVICE=cpu

faster-whisper-server
