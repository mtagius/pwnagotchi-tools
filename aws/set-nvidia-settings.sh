#!/bin/bash

nvidia-smi -pm 1
nvidia-smi -acp 0
nvidia-smi ––auto-boost-permission=0
nvidia-smi -ac 2505,875