# Rust wiki crate

> Rust crate to do operations on LA wiki + markdown

Will be used in src-tauri (desktop app) but also the CLI.

## Run

Assumes `bun dev-setup` was run at root and `seed` folder is present at root.

```
cargo watch -q -- sh -c "tput reset && cargo test -q --lib"
```
