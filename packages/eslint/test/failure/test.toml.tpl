# Intentionally malformed TOML
[package
name = "bad-toml"
version = 1.0.0

[server]
  port = "not-a-number-should-be-int"
    host = localhost
