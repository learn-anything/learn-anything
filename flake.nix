{
  inputs = {
    # TODO: switch to nixpkgs-unstable when this commit is there
    nixpkgs.url = "github:nixos/nixpkgs/69f3b4defe91949a97ca751ada931525d391e0fc";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };
  outputs =
    inputs@{ nixpkgs, flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = nixpkgs.lib.platforms.all;
      perSystem =
        { pkgs, ... }:
        let
          cargo-tauri = pkgs.callPackage ./nix/cargo-tauri.nix { };
        in
        {
          devShells.default = pkgs.mkShell {
            packages = [
              pkgs.bun
              pkgs.nodejs
              cargo-tauri
            ];
          };
          # TODO: Package LA using Nix
        };
    };
}
