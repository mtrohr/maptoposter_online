# City Map Poster Generator

Generate beautiful, minimalist map posters for any city in the world. Available as a CLI tool and a web application (SaaS).

<img src="posters/singapore_neon_cyberpunk_20260118_153328.png" width="250">
<img src="posters/dubai_midnight_blue_20260118_140807.png" width="250">

## Examples

| Country      | City           | Theme           | Poster |
|:------------:|:--------------:|:---------------:|:------:|
| USA          | San Francisco  | sunset          | <img src="posters/san_francisco_sunset_20260118_144726.png" width="250"> |
| Spain        | Barcelona      | warm_beige      | <img src="posters/barcelona_warm_beige_20260118_140048.png" width="250"> |
| Italy        | Venice         | blueprint       | <img src="posters/venice_blueprint_20260118_140505.png" width="250"> |
| Japan        | Tokyo          | japanese_ink    | <img src="posters/tokyo_japanese_ink_20260118_142446.png" width="250"> |
| India        | Mumbai         | contrast_zones  | <img src="posters/mumbai_contrast_zones_20260118_145843.png" width="250"> |
| Morocco      | Marrakech      | terracotta      | <img src="posters/marrakech_terracotta_20260118_143253.png" width="250"> |
| Singapore    | Singapore      | neon_cyberpunk  | <img src="posters/singapore_neon_cyberpunk_20260118_153328.png" width="250"> |
| Australia    | Melbourne      | forest          | <img src="posters/melbourne_forest_20260118_153446.png" width="250"> |
| UAE          | Dubai          | midnight_blue   | <img src="posters/dubai_midnight_blue_20260118_140807.png" width="250"> |
| USA          | Seattle        | emerald         | <img src="posters/seattle_emerald_20260124_162244.png" width="250"> |

---

## Web Application (SaaS)

The `web/` directory contains a React + TypeScript SaaS frontend that lets users create posters through a browser. Poster generation is powered by the same Python script, executed on the server via Supabase Edge Functions and a background worker.

### Tech Stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS v4
- **Backend:** Supabase (Postgres, Auth, Storage, Realtime, Edge Functions)
- **Payments:** Stripe (credit-based, not subscriptions)
- **Styling:** Custom earthy color system (sand/terra/ocean palettes), Inter font, responsive

### Web Architecture

```text
Browser (React SPA)
  |
  +--> Supabase Auth (email/password)
  +--> Supabase Postgres (themes, jobs, profiles, credits, pricing)
  +--> Supabase Realtime (live job status updates)
  +--> Supabase Storage (poster files + thumbnails in private buckets)
  +--> Supabase Edge Functions (Stripe checkout, job submission, webhook handler)
  |
  +--> Background Worker (picks up queued jobs, runs create_map_poster.py, uploads results)
```

### Web Project Structure

```text
web/
├── index.html
├── package.json
├── vite.config.ts                  # Vite config with Tailwind plugin, @ alias, envDir: ../
├── tsconfig.app.json               # TS config with @/* path alias
├── src/
│   ├── main.tsx                    # React entry point
│   ├── App.tsx                     # Router setup with all routes
│   ├── index.css                   # Tailwind v4 @theme with sand/terra/ocean color ramps
│   ├── lib/
│   │   ├── supabase.ts            # Singleton Supabase client (reads VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY from ../.env)
│   │   └── types.ts               # TypeScript interfaces for all DB tables
│   ├── context/
│   │   └── AuthContext.tsx         # Auth provider (session, user, profile, signUp/signIn/signOut, refreshProfile)
│   ├── components/
│   │   ├── Layout.tsx              # Main layout: sticky header, nav, mobile menu, user dropdown, credit badge, footer
│   │   ├── ProtectedRoute.tsx      # Route guards: ProtectedRoute (auth check) + AdminRoute (role check)
│   │   └── AdminLayout.tsx         # Admin sidebar layout with 8 nav items + Outlet
│   └── pages/
│       ├── Landing.tsx             # Marketing page: hero, theme showcase grid (17 SVG previews), features, CTAs
│       ├── Login.tsx               # Email/password login form, redirects to /dashboard on success
│       ├── Signup.tsx              # Registration form (display name, email, password), redirects to /dashboard
│       ├── Dashboard.tsx           # User's poster grid (fetches poster_jobs, shows status badges, thumbnails)
│       ├── CreatePoster.tsx        # Poster creation form: city/country, theme picker, resolution presets, distance slider, format toggle
│       ├── PosterDetail.tsx        # Single job view with Realtime subscription, thumbnail, metadata, download button
│       ├── Pricing.tsx             # Credit packages from DB, "best value" highlight, credit cost breakdown
│       └── admin/
│           ├── AdminDashboard.tsx  # Aggregate stats: total users, total jobs, completed jobs
│           ├── AdminUsers.tsx      # User table with search, role badges, credit balances
│           ├── AdminPricing.tsx    # Read-only pricing config viewer (base cost, format/resolution multipliers)
│           ├── AdminPackages.tsx   # Credit packages table (name, credits, price, active status)
│           ├── AdminThemes.tsx     # Theme cards with SVG previews and color swatches
│           ├── AdminResolutions.tsx # Resolution presets table (label, inches, pixels, category)
│           ├── AdminJobs.tsx       # All poster jobs table (city, theme, format, status, date)
│           └── AdminSettings.tsx   # System settings viewer (max jobs, maintenance mode, etc.)
```

### Routes

| Path | Auth | Component | Description |
|------|------|-----------|-------------|
| `/` | Public | Landing | Marketing/landing page |
| `/login` | Public | Login | Email/password sign in |
| `/signup` | Public | Signup | Create account |
| `/pricing` | Public | Pricing | Credit packages and pricing info |
| `/dashboard` | User | Dashboard | User's poster history grid |
| `/create` | User | CreatePoster | Poster configuration and submission form |
| `/poster/:id` | User | PosterDetail | Single poster job detail with realtime status |
| `/admin` | Admin | AdminDashboard | Admin stats overview |
| `/admin/users` | Admin | AdminUsers | User management table |
| `/admin/pricing` | Admin | AdminPricing | Pricing config viewer |
| `/admin/packages` | Admin | AdminPackages | Credit packages table |
| `/admin/themes` | Admin | AdminThemes | Theme management cards |
| `/admin/resolutions` | Admin | AdminResolutions | Resolution presets table |
| `/admin/jobs` | Admin | AdminJobs | All jobs table |
| `/admin/settings` | Admin | AdminSettings | System settings viewer |

### Color System

The web app uses a custom warm, earthy palette defined in `web/src/index.css` via Tailwind v4 `@theme`:

- **sand-50 to sand-950:** Neutral warm tones for backgrounds, text, borders
- **terra-50 to terra-950:** Terracotta/sienna tones for primary actions and branding
- **ocean-50 to ocean-950:** Muted teal/blue tones for secondary accents
- **success/warning/error:** Standard semantic colors (green, amber, red)

### Environment Variables

Stored in the project root `.env` file (not inside `web/`). Vite reads them via `envDir: '../'` in vite.config.ts.

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

---

## Database Schema (Supabase)

All migrations are in `supabase/migrations/`. 10 migration files create the full schema.

### Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | User profiles with email, display name, role (user/admin), credit balance | Users read/update own; admins read/update all |
| `themes` | Map color themes (17 seeded) with slug, display name, colors jsonb | Public read active; admins CRUD |
| `resolution_presets` | Print/digital/social size presets (6 seeded) | Public read active; admins CRUD |
| `pricing_config` | Credit cost calculation rules (base cost + format/resolution/distance multipliers) | Public read; admins update |
| `credit_packages` | Purchasable credit bundles with Stripe price IDs (3 seeded) | Public read active; admins CRUD |
| `credit_transactions` | Immutable credit ledger (purchase/usage/refund/adjustment) | Users read own; admins read all |
| `payments` | Stripe payment records per user | Users read own; admins read all |
| `poster_jobs` | Poster generation jobs with full config and lifecycle tracking | Users read own; admins read all |
| `system_settings` | Key-value system config (6 seeded: max jobs, maintenance mode, etc.) | Authenticated read; admins update/insert |

### Storage Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| `posters` | Full-resolution generated poster files | Users read own (`{user_id}/` prefix); admins read all |
| `thumbnails` | Preview images for poster jobs | Users read own; admins read all |

File naming convention: `{user_id}/{job_id}.{format}` (posters), `{user_id}/{job_id}_thumb.png` (thumbnails).

### Key Triggers

- **`on_auth_user_created`:** Auto-creates a `profiles` row when a new auth user signs up (pulls email and display_name from user metadata).
- **`handle_updated_at`:** Auto-updates `updated_at` on profiles and payments tables.

### Seed Data

- 17 themes (all classic map styles from the CLI tool)
- 6 resolution presets (default poster, A4, 4K, HD, mobile, Instagram)
- 3 credit packages (Starter 5/$4.99, Popular 20/$14.99, Pro 50/$29.99)
- 1 pricing config (1 base credit, PNG 1x, SVG/PDF 2x multipliers)
- 6 system settings (max_concurrent_jobs=3, maintenance_mode=false, etc.)

---

## Implementation Plan

### Phase 1: Database Schema and Migrations -- COMPLETED

Set up all Supabase tables, RLS policies, triggers, storage buckets, and seed data. 10 migration files covering profiles, themes, resolution presets, pricing config, credit packages, credit transactions, payments, poster jobs, system settings, and storage.

### Phase 2: Frontend Scaffolding -- COMPLETED

- Initialized React + TypeScript + Vite project in `web/`
- Installed and configured Tailwind CSS v4 with custom sand/terra/ocean color system
- Created Supabase client singleton reading env vars from parent directory
- Built AuthContext with full session management (signUp, signIn, signOut, profile fetching)
- Set up React Router with 16 routes: 4 public, 3 protected, 8 admin (nested under AdminLayout)
- Created responsive Layout with sticky header, mobile menu, user dropdown, credit badge, footer
- Created ProtectedRoute (auth guard) and AdminRoute (role guard) components
- Built all page components:
  - Landing page with theme showcase, feature grid, and CTAs
  - Login and Signup forms with error handling
  - Dashboard with poster job grid and status badges
  - CreatePoster form with theme picker, resolution presets, distance slider, format toggle
  - PosterDetail with Supabase Realtime subscription for live status updates
  - Pricing page pulling packages from DB
  - Full admin panel (8 pages) reading live data from all tables
- Build passes with zero TypeScript errors

### Phase 3: Poster Job Submission -- TODO

- Wire the CreatePoster form to insert jobs into `poster_jobs` table
- Calculate credit cost based on pricing config (format + resolution multipliers)
- Deduct credits from user balance atomically (DB function or edge function)
- Create `submit-poster-job` Edge Function:
  - Validate inputs and check credit balance
  - Insert poster_jobs row with status='queued'
  - Deduct credits and create credit_transaction record
  - Return the new job ID
- Redirect user to PosterDetail page after submission
- Handle insufficient credits with appropriate error messaging
- Add credit balance refresh after job submission

### Phase 4: Background Worker and Poster Generation -- TODO

- Create a worker process that polls `poster_jobs` for queued jobs
- Execute `create_map_poster.py` with job parameters
- Upload generated poster to Supabase Storage `posters` bucket
- Generate and upload thumbnail to `thumbnails` bucket
- Update job status (processing -> completed/failed)
- Handle errors gracefully (set status='failed', populate error_message)
- Respect system settings (max_concurrent_jobs, maintenance_mode)
- Update `started_at` and `completed_at` timestamps

### Phase 5: Stripe Payments -- TODO

- Create `create-checkout` Edge Function:
  - Create Stripe checkout session for selected credit package
  - Create pending payment record in `payments` table
  - Return checkout URL to frontend
- Create `stripe-webhook` Edge Function:
  - Handle `checkout.session.completed` event
  - Update payment status to 'completed'
  - Add credits to user's balance
  - Create credit_transaction record
- Wire frontend "Buy Credits" buttons to create-checkout
- Add success/cancel redirect pages
- Handle webhook signature verification

### Phase 6: Polish and Production Readiness -- TODO

- Wire admin editing capabilities (themes, packages, pricing, settings, user role management)
- Add poster download functionality (signed URLs from Supabase Storage)
- Add loading skeletons and optimistic UI updates
- Error boundaries and global error handling
- User profile editing
- Credit transaction history page
- Job retry/re-queue functionality for failed jobs
- Responsive polish and accessibility improvements
- Performance optimization (lazy loading routes, image optimization)

---

## CLI Tool

### Installation

#### With uv (Recommended)

Make sure [uv](https://docs.astral.sh/uv/) is installed. Running the script by prepending `uv run` automatically creates and manages a virtual environment.

```bash
# First run will automatically install dependencies
uv run ./create_map_poster.py --city "Paris" --country "France"

# Or sync dependencies explicitly first (using locked versions)
uv sync --locked
uv run ./create_map_poster.py --city "Paris" --country "France"
```

#### With pip + venv

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Usage

If you're using `uv`:

```bash
uv run ./create_map_poster.py --city <city> --country <country> [options]
```

Otherwise (pip + venv):

```bash
python create_map_poster.py --city <city> --country <country> [options]
```

### Required Options

| Option | Short | Description |
|--------|-------|-------------|
| `--city` | `-c` | City name (used for geocoding) |
| `--country` | `-C` | Country name (used for geocoding) |

### Optional Flags

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--latitude` | `-lat` | Override latitude center point (use with --longitude) | |
| `--longitude` | `-long` | Override longitude center point (use with --latitude) | |
| `--country-label` | | Override country text displayed on poster | |
| `--theme` | `-t` | Theme name | terracotta |
| `--distance` | `-d` | Map radius in meters | 18000 |
| `--list-themes` | | List all available themes | |
| `--all-themes` | | Generate posters for all available themes | |
| `--width` | `-W` | Image width in inches | 12 (max: 20) |
| `--height` | `-H` | Image height in inches | 16 (max: 20) |

### Multilingual Support

Display city and country names in your language with custom fonts from Google Fonts:

| Option | Short | Description |
|--------|-------|-------------|
| `--display-city` | `-dc` | Custom display name for city (e.g., "東京") |
| `--display-country` | `-dC` | Custom display name for country (e.g., "日本") |
| `--font-family` | | Google Fonts family name (e.g., "Noto Sans JP") |

**Examples:**

```bash
# Japanese
python create_map_poster.py -c "Tokyo" -C "Japan" -dc "東京" -dC "日本" --font-family "Noto Sans JP"

# Korean
python create_map_poster.py -c "Seoul" -C "South Korea" -dc "서울" -dC "대한민국" --font-family "Noto Sans KR"

# Arabic
python create_map_poster.py -c "Dubai" -C "UAE" -dc "دبي" -dC "الإمارات" --font-family "Cairo"
```

**Note**: Fonts are automatically downloaded from Google Fonts and cached locally in `fonts/cache/`.

### Resolution Guide (300 DPI)

| Target | Resolution (px) | Inches (-W / -H) |
|--------|-----------------|------------------|
| **Instagram Post** | 1080 x 1080 | 3.6 x 3.6 |
| **Mobile Wallpaper** | 1080 x 1920 | 3.6 x 6.4 |
| **HD Wallpaper** | 1920 x 1080 | 6.4 x 3.6 |
| **4K Wallpaper** | 3840 x 2160 | 12.8 x 7.2 |
| **A4 Print** | 2480 x 3508 | 8.3 x 11.7 |

### CLI Examples

```bash
# Simple usage with default theme
python create_map_poster.py -c "Paris" -C "France"

# With custom theme and distance
python create_map_poster.py -c "New York" -C "USA" -t noir -d 12000

# Japanese with native script
python create_map_poster.py -c "Tokyo" -C "Japan" -dc "東京" -dC "日本" --font-family "Noto Sans JP" -t japanese_ink

# Override center coordinates
python create_map_poster.py --city "New York" --country "USA" -lat 40.776676 -long -73.971321 -t noir

# List available themes
python create_map_poster.py --list-themes

# Generate posters for every theme
python create_map_poster.py -c "Tokyo" -C "Japan" --all-themes
```

### Distance Guide

| Distance | Best for |
|----------|----------|
| 4000-6000m | Small/dense cities (Venice, Amsterdam center) |
| 8000-12000m | Medium cities, focused downtown (Paris, Barcelona) |
| 15000-20000m | Large metros, full city view (Tokyo, Mumbai) |

## Themes

17 themes available in `themes/` directory:

| Theme | Style |
|-------|-------|
| `gradient_roads` | Smooth gradient shading |
| `contrast_zones` | High contrast urban density |
| `noir` | Pure black background, white roads |
| `midnight_blue` | Navy background with gold roads |
| `blueprint` | Architectural blueprint aesthetic |
| `neon_cyberpunk` | Dark with electric pink/cyan |
| `warm_beige` | Vintage sepia tones |
| `pastel_dream` | Soft muted pastels |
| `japanese_ink` | Minimalist ink wash style |
| `emerald`      | Lush dark green aesthetic |
| `forest` | Deep greens and sage |
| `ocean` | Blues and teals for coastal cities |
| `terracotta` | Mediterranean warmth |
| `sunset` | Warm oranges and pinks |
| `autumn` | Seasonal burnt oranges and reds |
| `copper_patina` | Oxidized copper aesthetic |
| `monochrome_blue` | Single blue color family |

## Output

Posters are saved to `posters/` directory with format:

```text
{city}_{theme}_{YYYYMMDD_HHMMSS}.png
```

## Adding Custom Themes

Create a JSON file in `themes/` directory:

```json
{
  "name": "My Theme",
  "description": "Description of the theme",
  "bg": "#FFFFFF",
  "text": "#000000",
  "gradient_color": "#FFFFFF",
  "water": "#C0C0C0",
  "parks": "#F0F0F0",
  "road_motorway": "#0A0A0A",
  "road_primary": "#1A1A1A",
  "road_secondary": "#2A2A2A",
  "road_tertiary": "#3A3A3A",
  "road_residential": "#4A4A4A",
  "road_default": "#3A3A3A"
}
```

## Project Structure

```text
map_poster/
├── create_map_poster.py        # Main poster generation script (CLI)
├── font_management.py          # Font loading and Google Fonts integration
├── themes/                     # Theme JSON files (17 themes)
├── fonts/                      # Font files
│   ├── Roboto-*.ttf            # Default Roboto fonts
│   └── cache/                  # Downloaded Google Fonts (auto-generated)
├── posters/                    # Generated posters (CLI output)
├── supabase/
│   └── migrations/             # 10 SQL migration files (full schema + seed data)
├── web/                        # React SaaS frontend (see Web Project Structure above)
├── .env                        # Environment variables (Supabase URL + anon key)
└── README.md
```

## Hacker's Guide

Quick reference for contributors who want to extend or modify the script.

### Contributors Guide

- Bug fixes are welcomed
- Don't submit user interface (web/desktop)
- Don't Dockerize for now
- If you vibe code any fix please test it and see before and after version of poster
- Before embarking on a big feature please ask in Discussions/Issue if it will be merged

### Architecture Overview

```text
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   CLI Parser    │────>│  Geocoding   │────>│  Data Fetching  │
│   (argparse)    │     │  (Nominatim) │     │    (OSMnx)      │
└─────────────────┘     └──────────────┘     └─────────────────┘
                                                     │
                        ┌──────────────┐             v
                        │    Output    │<────┌─────────────────┐
                        │  (matplotlib)│     │   Rendering     │
                        └──────────────┘     │  (matplotlib)   │
                                             └─────────────────┘
```

### Key Functions

| Function | Purpose | Modify when... |
|----------|---------|----------------|
| `get_coordinates()` | City -> lat/lon via Nominatim | Switching geocoding provider |
| `create_poster()` | Main rendering pipeline | Adding new map layers |
| `get_edge_colors_by_type()` | Road color by OSM highway tag | Changing road styling |
| `get_edge_widths_by_type()` | Road width by importance | Adjusting line weights |
| `create_gradient_fade()` | Top/bottom fade effect | Modifying gradient overlay |
| `load_theme()` | JSON theme -> dict | Adding new theme properties |
| `is_latin_script()` | Detects script for typography | Supporting new scripts |
| `load_fonts()` | Load custom/default fonts | Changing font loading logic |

### Rendering Layers (z-order)

```text
z=11  Text labels (city, country, coords)
z=10  Gradient fades (top & bottom)
z=3   Roads (via ox.plot_graph)
z=2   Parks (green polygons)
z=1   Water (blue polygons)
z=0   Background color
```

### OSM Highway Types -> Road Hierarchy

```python
# In get_edge_colors_by_type() and get_edge_widths_by_type()
motorway, motorway_link     -> Thickest (1.2), darkest
trunk, primary              -> Thick (1.0)
secondary                   -> Medium (0.8)
tertiary                    -> Thin (0.6)
residential, living_street  -> Thinnest (0.4), lightest
```

### Typography & Script Detection

The script automatically detects text scripts to apply appropriate typography:

- **Latin scripts** (English, French, Spanish, etc.): Letter spacing applied for elegant "P  A  R  I  S" effect
- **Non-Latin scripts** (Japanese, Arabic, Thai, Korean, etc.): Natural spacing for "東京" (no gaps between characters)

Script detection uses Unicode ranges (U+0000-U+024F for Latin). If >80% of alphabetic characters are Latin, spacing is applied.

### Adding New Features

**New map layer (e.g., railways):**

```python
# In create_poster(), after parks fetch:
try:
    railways = ox.features_from_point(point, tags={'railway': 'rail'}, dist=dist)
except:
    railways = None

# Then plot before roads:
if railways is not None and not railways.empty:
    railways.plot(ax=ax, color=THEME['railway'], linewidth=0.5, zorder=2.5)
```

**New theme property:**

1. Add to theme JSON: `"railway": "#FF0000"`
2. Use in code: `THEME['railway']`
3. Add fallback in `load_theme()` default dict

### Typography Positioning

All text uses `transform=ax.transAxes` (0-1 normalized coordinates):

```text
y=0.14  City name (spaced letters for Latin scripts)
y=0.125 Decorative line
y=0.10  Country name
y=0.07  Coordinates
y=0.02  Attribution (bottom-right)
```

### Useful OSMnx Patterns

```python
# Get all buildings
buildings = ox.features_from_point(point, tags={'building': True}, dist=dist)

# Get specific amenities
cafes = ox.features_from_point(point, tags={'amenity': 'cafe'}, dist=dist)

# Different network types
G = ox.graph_from_point(point, dist=dist, network_type='drive')  # roads only
G = ox.graph_from_point(point, dist=dist, network_type='bike')   # bike paths
G = ox.graph_from_point(point, dist=dist, network_type='walk')   # pedestrian
```

### Performance Tips

- Large `dist` values (>20km) = slow downloads + memory heavy
- Cache coordinates locally to avoid Nominatim rate limits
- Use `network_type='drive'` instead of `'all'` for faster renders
- Reduce `dpi` from 300 to 150 for quick previews
