# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.nodePackages.pnpm
    pkgs.bun
    pkgs.python312
    pkgs.python312Packages.uvicorn
  ];

  # --- THIS IS THE FIX ---
  # We are setting the environment variable for the entire workspace.
  # This is the correct, Nix-idiomatic way to do this.
  env = {
    NEXT_PUBLIC_SITE_URL = "https://3000-firebase-haven-1753564061535.cluster-rhptpnrfenhe4qarq36djxjqmg.cloudworkstations.dev";
  };

  idx = {
    extensions = [
      # "vscodevim.vim"
    ];
    workspace = {
      onCreate = {
        npm-install = "npm --prefix frontend install";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          # The command is restored to its original, simple state.
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
