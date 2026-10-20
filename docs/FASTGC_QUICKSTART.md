# FAST-GC — Quick-start commands

> CLI syntax checked against the supplied `fastgc --help`. Replace the example input/output paths. These are **starter configurations**, not universal scientific optima.

## Install and inspect

```powershell
python -m pip install fastgc
fastgc --version
fastgc --help
```

| Parameter | Function / definition | Configuration guidance |
|---|---|---|
| `fastgc --version` | Print installed version | Record alongside scientific outputs |
| `fastgc --help` | Inspect available options | Run after updating the package |

## ALS ground classification

```powershell
fastgc --in_path "C:\data\survey.las" --out_dir "C:\data\als_output" --sensor_mode ALS --workflow run --products FAST_GC
```

| Parameter | Function / definition | Configuration guidance |
|---|---|---|
| `--in_path` | Input point cloud | Use LAS/LAZ file or supported folder |
| `--out_dir` | Output directory | Keep separate from raw data |
| `--sensor_mode ALS` | Airborne sensor pipeline | Change to ULS or TLS only for the matching sensor |
| `--workflow run` | Standard processing | Prefer `tile-run-merge` for large surveys |
| `--products FAST_GC` | Classified ground product | CLI default, stated explicitly for clarity |

## Large ALS survey: classify, merge DEM and derive terrain

```powershell
fastgc --in_path "C:\data\survey.las" --out_dir "C:\data\terrain_output" `
  --sensor_mode ALS --workflow tile-run-merge `
  --products FAST_GC FAST_DEM FAST_TERRAIN `
  --grid_res 0.5 --tile_size_m 140 --buffer_m 4 `
  --jobs 6 --joblib_backend loky `
  --terrain_products all --terrain_output both `
  --stream_threshold_area_m2 1000 --stream_min_order 1
```

| Parameter | Function / definition | Configuration guidance |
|---|---|---|
| `--workflow tile-run-merge` | Tile, process and merge | Appropriate for large surveys |
| `--products` | Ground, DEM and terrain | Terrain derived from continuous merged DEM in integrated workflow |
| `--grid_res 0.5` | Raster resolution in horizontal map units | Site 15 example; adapt to survey density |
| `--tile_size_m 140` | Tile core dimension (m) | Site 15 tested example; not a universal optimum |
| `--buffer_m 4` | Tile halo (m) | Ensure adequate neighborhood support |
| `--jobs 6` | Parallel workers | Benchmark-dependent; consider available RAM |
| `--joblib_backend loky` | Multiprocessing backend | Observed in Site 15 example |
| `--terrain_products all` | All registered terrain products | Can increase runtime and storage |
| `--terrain_output both` | Raster and vector | Vector topology should be inspected separately |
| `--stream_threshold_area_m2 1000` | Channel initiation area (m²) | Requires projected horizontal units in metres |
| `--stream_min_order 1` | Minimum vector stream order | Includes headwater links |

## Existing merged DEM: terrain without reclassification

```powershell
fastgc --in_path "C:\data\merged_dem.tif" --out_dir "C:\data\terrain_only" `
  --workflow derive-only --products FAST_TERRAIN `
  --terrain_products all --terrain_output both
```

| Parameter | Function / definition | Configuration guidance |
|---|---|---|
| `--in_path` | Existing DEM | Use authoritative continuous DEM, not a tile |
| `--workflow derive-only` | Derivatives without ground classification | CLI confirmed; separate runtime verification recommended |
| `--products FAST_TERRAIN` | Terrain derivatives | Use terrain flags for selection |
| `--terrain_output both` | Raster and vector outputs | Requires geospatially valid DEM |

## Additional product selection

```powershell
fastgc --in_path "C:\data\survey.las" --out_dir "C:\data\canopy_output" `
  --sensor_mode ALS --workflow run `
  --products FAST_GC FAST_DEM FAST_NORMALIZED FAST_DSM FAST_CHM `
  --chm_method pitfree
```

| Parameter | Function / definition | Configuration guidance |
|---|---|---|
| `--products` | Request canopy-related products | Confirm dependencies and output contracts for the dataset |
| `--chm_method pitfree` | CHM method | One supported choice; no claim of universal superiority |

## Reference

See **Chapter 7** for all options, accepted values and descriptions. See **Chapters 3–6** for scientific methodology and case studies.
