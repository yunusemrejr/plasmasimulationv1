#!/usr/bin/env bash
#
# PlasmaSim Launcher
# ------------------
# 1. Ensures Python environment (prefers venv)
# 2. Installs dependencies from requirements.txt (with multiple fallback strategies)
# 3. Starts the Flask server (which picks a random free port automatically)
# 4. The Python app also auto-opens your browser
#
# Usage:
#   ./run.sh
#   or double-click the file in your file manager (make sure it is executable)
#

set -u

# -----------------------------------------------------------------------------
# Move to the directory containing this script (so it works when launched from anywhere)
# -----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Pretty output helpers
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

info()    { echo -e "${CYAN}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC}   $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERR]${NC}  $1"; }

# -----------------------------------------------------------------------------
# 1. Locate a usable Python 3 interpreter
# -----------------------------------------------------------------------------
PYTHON_CMD=""
for cmd in python3 python; do
    if command -v "$cmd" >/dev/null 2>&1; then
        if "$cmd" -c 'import sys; exit(0 if sys.version_info >= (3, 7) else 1)' 2>/dev/null; then
            PYTHON_CMD="$cmd"
            break
        fi
    fi
done

if [[ -z "$PYTHON_CMD" ]]; then
    error "Python 3.7+ is required but was not found."
    error "Please install Python 3 (e.g. sudo apt install python3 python3-venv python3-pip)"
    exit 1
fi

info "Using Python: $($PYTHON_CMD --version 2>&1)"

# -----------------------------------------------------------------------------
# 2. Virtual environment handling (strongly preferred)
# -----------------------------------------------------------------------------
VENV_DIR=".venv"
VENV_ACTIVATED=0

create_venv() {
    info "Creating virtual environment in ${VENV_DIR}..."
    if "$PYTHON_CMD" -m venv "$VENV_DIR" 2>/dev/null; then
        success "Virtual environment created."
        return 0
    else
        warn "venv creation failed (python3-venv may be missing)."
        return 1
    fi
}

activate_venv() {
    if [[ -f "$VENV_DIR/bin/activate" ]]; then
        # shellcheck disable=SC1091
        source "$VENV_DIR/bin/activate"
        PYTHON_CMD="python"
        VENV_ACTIVATED=1
        success "Virtual environment activated."
        return 0
    fi
    return 1
}

# Try to use or create venv
if [[ -d "$VENV_DIR" ]]; then
    activate_venv || warn "Existing venv could not be activated, will try system Python."
else
    if create_venv; then
        activate_venv
    else
        warn "Proceeding with system Python (may require --user installs)."
    fi
fi

# -----------------------------------------------------------------------------
# 3. Dependency installation with recursive / fallback solving
# -----------------------------------------------------------------------------
install_requirements() {
    local req_file="requirements.txt"
    if [[ ! -f "$req_file" ]]; then
        warn "No requirements.txt found - skipping dependency install."
        return 0
    fi

    info "Installing Python dependencies from $req_file ..."

    # Strategy 1: normal pip install
    if $PYTHON_CMD -m pip install -r "$req_file" --quiet 2>/dev/null; then
        success "Dependencies installed successfully."
        return 0
    fi

    warn "First pip install attempt failed. Entering recursive repair mode..."

    # Strategy 2: upgrade pip first, then retry
    $PYTHON_CMD -m pip install --upgrade pip wheel setuptools 2>/dev/null || true

    if $PYTHON_CMD -m pip install -r "$req_file" --prefer-binary 2>/dev/null; then
        success "Dependencies installed on second attempt."
        return 0
    fi

    # Strategy 3: force reinstall + no cache
    warn "Second attempt failed. Clearing cache and forcing reinstall..."
    $PYTHON_CMD -m pip cache purge 2>/dev/null || true
    if $PYTHON_CMD -m pip install -r "$req_file" --force-reinstall --no-cache-dir 2>/dev/null; then
        success "Dependencies installed after cache purge."
        return 0
    fi

    # Strategy 4: install Flask directly as last resort (most common need)
    warn "Recursive solve: installing Flask directly as fallback..."
    if $PYTHON_CMD -m pip install Flask 2>/dev/null; then
        success "Flask installed via direct fallback."
        return 0
    fi

    # Strategy 5: system package manager hints (Ubuntu/Mint/Debian)
    if command -v apt-get >/dev/null 2>&1; then
        warn "Trying system-level Python packages (may need sudo)..."
        if sudo apt-get update -qq && sudo apt-get install -y -qq python3-flask 2>/dev/null; then
            success "System python3-flask package installed."
            return 0
        fi
    fi

    # Final failure
    error "All installation strategies failed."
    error "Please run manually: $PYTHON_CMD -m pip install -r requirements.txt"
    error "Or: sudo apt install python3-flask python3-venv python3-pip"
    return 1
}

# Run the installer (will not exit script on failure thanks to || handling inside)
install_requirements || {
    warn "Continuing anyway - the server may still work if Flask is already present."
}

# -----------------------------------------------------------------------------
# 4. Final verification that Flask can be imported
# -----------------------------------------------------------------------------
if ! $PYTHON_CMD -c "import flask; print('Flask version:', flask.__version__)" 2>/dev/null; then
    error "Flask still cannot be imported after all repair attempts."
    error "Try: $PYTHON_CMD -m pip install --user Flask"
    exit 1
fi

success "All Python dependencies verified."

# -----------------------------------------------------------------------------
# 5. Launch the Flask application (it will pick its own free port)
# -----------------------------------------------------------------------------
info "Starting PlasmaSim Flask server..."
echo ""

# Make sure the app is executable (in case)
chmod +x app.py 2>/dev/null || true

# Execute the server (this blocks until user hits Ctrl+C)
exec $PYTHON_CMD app.py