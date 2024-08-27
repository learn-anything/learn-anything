{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };
  outputs = inputs@{ nixpkgs, flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = nixpkgs.lib.platforms.all;
      perSystem = { pkgs, ... }: {
        devShells.default =
          pkgs.mkShell { packages = [ pkgs.bun pkgs.nodejs ]; };
        # TODO: Package LA using Nix
      };
    };
}
