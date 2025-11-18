# Example TOML Configuration
[package]
name = "example-package"
version = "1.0.0"
description = "A sample TOML configuration file"

[dependencies]
lodash = "^4.17.21"
express = "^4.18.0"

[server]
host = "localhost"
port = 8080
debug = true

[[features]]
name = "authentication"
enabled = true

[[features]]
name = "logging"
enabled = false
