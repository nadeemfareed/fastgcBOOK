# Chapter 7 — FAST-GC Command Reference

> Source: `fastgc --help`, source commit `ac3a112a393a074ca7645a790f603c531f8d5fc6`. This reference describes **advertised CLI options**, not a claim that every product has been benchmark-validated.

## 7.1 Canonical command and conventions

```powershell
fastgc --in_path "C:\data\survey.las" --out_dir "C:\data\output" --sensor_mode ALS --workflow run --products FAST_GC
```

| Parameter | Function / definition | Configuration guidance |
|---|---|---|
| `--in_path` | Input LAS/LAZ, folder, or product root | Required; do not use `--input` |
| `--sensor_mode` | ALS, ULS, or TLS | Required for normal workflows |
| `--workflow` | Processing route | Select according to whether tiling or derivation is needed |
| `--products` | Output product family or families | Default is FAST_GC only; `all` requests full pipeline |

### Verified CLI values

- Workflows: `run`, `plots-run`, `tile-only`, `tile-run`, `tile-run-merge`, `merge`, `derive-only`.
- Sensors: `ALS`, `ULS`, `TLS`.
- Product selections: `FAST_GC`, `FAST_DEM`, `FAST_NORMALIZED`, `FAST_DSM`, `FAST_CHM`, `FAST_TERRAIN`, `FAST_CHANGE`, `FAST_ITD`, `FAST_STRUCTURE`, `FAST_TREECLOUDS`, `all`.
- Flags generally accept both underscore and hyphen spellings where advertised. Use the spellings shown in this chapter.

## 7.2 Complete option inventory

The third column preserves descriptions and documented defaults from the installed CLI. When the CLI does not state a default, it is **not inferred**.

### Execution and I/O

| Parameter / accepted syntax | Function / definition | Configuration guidance |
|---|---|---|
| `--in_path` | Input LAS/LAZ file, folder, or processed product root depending on workflow. | See accepted syntax: `--in_path IN_PATH, --in-path IN_PATH` |
| `--out_dir` | Output root folder. If omitted, outputs are created beside the input. | See accepted syntax: `--out_dir OUT_DIR, --out-dir OUT_DIR` |
| `--sensor_mode` | Sensor mode. Required for normal workflows and external plots-run inputs; managed FAST-GIS plots-run collections may read it from plots_manifest.json. | See accepted syntax: `--sensor_mode {ALS,ULS,TLS}, --sensor-mode {ALS,ULS,TLS}` |
| `--workflow` | Workflow to execute. | See accepted syntax: `--workflow {run,plots-run,tile-only,tile-run,tile-run-merge,merge,derive-only}` |
| `--jobs` | automatically uses available CPUs while reserving one core. Use 1 for sequential; negative values mean cpu_count+n+1. | See accepted syntax: `--jobs JOBS           Number of workers for tile-parallel stages. Default 0` |
| `--joblib_backend` | Execution backend for tile-parallel stages. | See accepted syntax: `--joblib_backend {loky,multiprocessing,sequential,threading}, --joblib-backend {loky,multiprocessing,sequential,threading}` |
| `--joblib_batch_size` | Joblib batch size for tile-parallel stages. Use 'auto' or an integer. | See accepted syntax: `--joblib_batch_size JOBLIB_BATCH_SIZE, --joblib-batch-size JOBLIB_BATCH_SIZE` |
| `--joblib_pre_dispatch` | Joblib pre_dispatch setting for tile-parallel stages. | See accepted syntax: `--joblib_pre_dispatch JOBLIB_PRE_DISPATCH, --joblib-pre-dispatch JOBLIB_PRE_DISPATCH` |
| `--products` | Products to write. Default is FAST_GC only. Use 'all' for the full pipeline. | See accepted syntax: `--products {all,FAST_GC,FAST_DEM,FAST_NORMALIZED,FAST_DSM,FAST_CHM,FAST_TERRAIN,FAST_CHANGE,FAST_ITD,FAST_STRUCTURE,FAST_TREECLOUDS} [{all,FAST_GC,FAST_DEM,FAST_NORMALIZED,FAST_DSM,FAST_CHM,FAST_TERRAIN,FAST_CHANGE,FAST_ITD,FAST_STRUCTURE,FAST_TREECLOUDS} ...]` |
| `--recursive` | CLI option | See accepted syntax: `--recursive           Recursively scan input folders.` |
| `--skip_existing` | Skip steps/products that appear already completed. | See accepted syntax: `--skip_existing, --skip-existing` |
| `--overwrite` | CLI option | See accepted syntax: `--overwrite           Overwrite existing downstream outputs.` |

### Raster, DSM and CHM

| Parameter / accepted syntax | Function / definition | Configuration guidance |
|---|---|---|
| `--grid_res` | Raster grid resolution. Default: 0.5 | See accepted syntax: `--grid_res GRID_RES, --grid-res GRID_RES` |
| `--dem_method` | DEM raster method. Default: min | See accepted syntax: `--dem_method {min,max,mean,nearest,idw}, --dem-method {min,max,mean,nearest,idw}` |
| `--dsm_method` | DSM raster method. Includes 'spikefree' for DSM-first spikefree routing. | See accepted syntax: `--dsm_method {min,max,mean,nearest,idw,spikefree}, --dsm-method {min,max,mean,nearest,idw,spikefree}` |
| `--chm_method` | Primary CHM mode. 'spikefree' is routed DSM-first; 'csf_chm' is cloth-simulation CHM. | See accepted syntax: `--chm_method {p2r,p99,tin,pitfree,adaptive_pitfree,csf_chm,spikefree,percentile,percentile_top,percentile_band}, --chm-method {p2r,p99,tin,pitfree,adaptive_pitfree,csf_chm,spikefree,percentile,percentile_top,percentile_band}` |
| `--chm_methods` | Optional list of CHM targets to generate in one run. Supports plain methods (e.g. p2r p99 pitfree csf_chm spikefree) and custom selector specs, e.g. 'percentile_top:pitfree:low=5' or 'percentile:pitfree:pct=5'. | See accepted syntax: `--chm_methods CHM_METHODS [CHM_METHODS ...], --chm-methods CHM_METHODS [CHM_METHODS ...]` |
| `--chm_surface_method` | Surface method used when chm_method is a selector family. | See accepted syntax: `--chm_surface_method {p2r,p99,tin,pitfree,adaptive_pitfree,csf_chm}, --chm-surface-method {p2r,p99,tin,pitfree,adaptive_pitfree,csf_chm}` |
| `--chm_smooth_method` | CHM post-smoothing method. | See accepted syntax: `--chm_smooth_method {none,median,gaussian}, --chm-smooth-method {none,median,gaussian}` |
| `--chm_percentile` | Percentile used for p99 or percentile selector. Default: 99 | See accepted syntax: `--chm_percentile CHM_PERCENTILE, --chm-percentile CHM_PERCENTILE` |
| `--chm_percentile_low` | Lower percentile bound for percentile_top or percentile_band. | See accepted syntax: `--chm_percentile_low CHM_PERCENTILE_LOW, --chm-percentile-low CHM_PERCENTILE_LOW` |
| `--chm_percentile_high` | Upper percentile bound for percentile_band. | See accepted syntax: `--chm_percentile_high CHM_PERCENTILE_HIGH, --chm-percentile-high CHM_PERCENTILE_HIGH` |
| `--chm_pitfree_thresholds` | Pit-free thresholds in normalized-height units. | See accepted syntax: `--chm_pitfree_thresholds [CHM_PITFREE_THRESHOLDS ...], --chm-pitfree-thresholds [CHM_PITFREE_THRESHOLDS ...]` |
| `--chm_use_first_returns` | Prefer first returns for eligible CHM methods. | See accepted syntax: `--chm_use_first_returns, --chm-use-first-returns` |
| `--chm_no_first_returns` | Disable first-return preference. | See accepted syntax: `--chm_no_first_returns, --chm-no-first-returns` |
| `--chm_spikefree_freeze_distance` | Spikefree freeze distance in map units. Used for DSM spikefree and derived CHM spikefree. | See accepted syntax: `--chm_spikefree_freeze_distance CHM_SPIKEFREE_FREEZE_DISTANCE, --chm-spikefree-freeze-distance CHM_SPIKEFREE_FREEZE_DISTANCE` |
| `--chm_spikefree_insertion_buffer` | Spikefree insertion buffer in height units. Used for DSM spikefree and derived CHM spikefree. | See accepted syntax: `--chm_spikefree_insertion_buffer CHM_SPIKEFREE_INSERTION_BUFFER, --chm-spikefree-insertion-buffer CHM_SPIKEFREE_INSERTION_BUFFER` |
| `--chm_median_size` | Median filter kernel size for CHM post-smoothing. Use 0 to disable. | See accepted syntax: `--chm_median_size CHM_MEDIAN_SIZE, --chm-median-size CHM_MEDIAN_SIZE` |
| `--chm_gaussian_sigma` | Gaussian sigma for CHM smoothing. Default: 1.0 | See accepted syntax: `--chm_gaussian_sigma CHM_GAUSSIAN_SIGMA, --chm-gaussian-sigma CHM_GAUSSIAN_SIGMA` |
| `--chm_min_height` | Minimum CHM height threshold; smaller values are set to 0. | See accepted syntax: `--chm_min_height CHM_MIN_HEIGHT, --chm-min-height CHM_MIN_HEIGHT` |
| `--chm_fill_ground_voids_zero` | Fill CHM voids with zero where support indicates ground/open cells. Default: on. | See accepted syntax: `--chm_fill_ground_voids_zero, --chm-fill-ground-voids-zero` |
| `--chm_no_fill_ground_voids_zero` | Disable CHM zero-filling for true ground/open voids. | See accepted syntax: `--chm_no_fill_ground_voids_zero, --chm-no-fill-ground-voids-zero` |
| `--chm_void_ground_threshold` | Threshold used to classify normalized support as true ground/open for CHM void filling. | See accepted syntax: `--chm_void_ground_threshold CHM_VOID_GROUND_THRESHOLD, --chm-void-ground-threshold CHM_VOID_GROUND_THRESHOLD` |

### FAST-TERRAIN and hydrology

| Parameter / accepted syntax | Function / definition | Configuration guidance |
|---|---|---|
| `--terrain_products` | Terrain products to generate when FAST_TERRAIN is requested. | See accepted syntax: `--terrain_products {d8_downslope_flow_length,curvature,d8_flow_accumulation,mfd_contributing_area,d8_specific_catchment_area,mean_curvature,slope_percent,tci,topographic_wetness_index,twi,tri,d8_longest_upslope_flow_length,planform_curvature,all,dtw,watershed_boundary,mfd_specific_catchment_area,conditioned_dem,subcatchment_id,d8_flow_direction,positive_openness,gaussian_curvature,profile_curvature,negative_openness,contributing_area_ls_factor,strahler_stream_order,tpi,basin_id,mfd_flow_accumulation,rusle_s_factor,hillshade,multiscale_tpi,stream_power_index,slope_degrees,stream_mask,local_relief,stream_link_id,tangential_curvature,depression_depth,roughness,aspect,d8_contributing_area} [{d8_downslope_flow_length,curvature,d8_flow_accumulation,mfd_contributing_area,d8_specific_catchment_area,mean_curvature,slope_percent,tci,topographic_wetness_index,twi,tri,d8_longest_upslope_flow_length,planform_curvature,all,dtw,watershed_boundary,mfd_specific_catchment_area,conditioned_dem,subcatchment_id,d8_flow_direction,positive_openness,gaussian_curvature,profile_curvature,negative_openness,contributing_area_ls_factor,strahler_stream_order,tpi,basin_id,mfd_flow_accumulation,rusle_s_factor,hillshade,multiscale_tpi,stream_power_index,slope_degrees,stream_mask,local_relief,stream_link_id,tangential_curvature,depression_depth,roughness,aspect,d8_contributing_area} ...], --terrain-products {d8_downslope_flow_length,curvature,d8_flow_accumulation,mfd_contributing_area,d8_specific_catchment_area,mean_curvature,slope_percent,tci,topographic_wetness_index,twi,tri,d8_longest_upslope_flow_length,planform_curvature,all,dtw,watershed_boundary,mfd_specific_catchment_area,conditioned_dem,subcatchment_id,d8_flow_direction,positive_openness,gaussian_curvature,profile_curvature,negative_openness,contributing_area_ls_factor,strahler_stream_order,tpi,basin_id,mfd_flow_accumulation,rusle_s_factor,hillshade,multiscale_tpi,stream_power_index,slope_degrees,stream_mask,local_relief,stream_link_id,tangential_curvature,depression_depth,roughness,aspect,d8_contributing_area} [{d8_downslope_flow_length,curvature,d8_flow_accumulation,mfd_contributing_area,d8_specific_catchment_area,mean_curvature,slope_percent,tci,topographic_wetness_index,twi,tri,d8_longest_upslope_flow_length,planform_curvature,all,dtw,watershed_boundary,mfd_specific_catchment_area,conditioned_dem,subcatchment_id,d8_flow_direction,positive_openness,gaussian_curvature,profile_curvature,negative_openness,contributing_area_ls_factor,strahler_stream_order,tpi,basin_id,mfd_flow_accumulation,rusle_s_factor,hillshade,multiscale_tpi,stream_power_index,slope_degrees,stream_mask,local_relief,stream_link_id,tangential_curvature,depression_depth,roughness,aspect,d8_contributing_area} ...]` |
| `--terrain_output` | FAST_TERRAIN output representation. Default: raster. Vector hydrology is generated from the authoritative continuous DEM. | See accepted syntax: `--terrain_output {raster,vector,both}, --terrain-output {raster,vector,both}` |
| `--stream_threshold_area_m2` | Minimum contributing area in square metres used to define the analytical stream network. Default: 1000. | See accepted syntax: `--stream_threshold_area_m2 STREAM_THRESHOLD_AREA_M2, --stream-threshold-area-m2 STREAM_THRESHOLD_AREA_M2` |
| `--stream_min_order` | Minimum Strahler order exported to vector stream layers. Does not alter the complete analytical raster. Default: 1. | See accepted syntax: `--stream_min_order STREAM_MIN_ORDER, --stream-min-order STREAM_MIN_ORDER` |
| `--hillshade_azimuth` | Hillshade illumination azimuth in degrees. Default: 315 | See accepted syntax: `--hillshade_azimuth HILLSHADE_AZIMUTH, --hillshade-azimuth HILLSHADE_AZIMUTH` |
| `--hillshade_altitude` | Hillshade illumination altitude in degrees. Default: 45 | See accepted syntax: `--hillshade_altitude HILLSHADE_ALTITUDE, --hillshade-altitude HILLSHADE_ALTITUDE` |
| `--hillshade_z_factor` | Hillshade z-factor. Default: 1.0 | See accepted syntax: `--hillshade_z_factor HILLSHADE_Z_FACTOR, --hillshade-z-factor HILLSHADE_Z_FACTOR` |
| `--tpi_radius` | Neighborhood radius in cells for TPI. Default: 3 | See accepted syntax: `--tpi_radius TPI_RADIUS, --tpi-radius TPI_RADIUS` |
| `--multiscale_tpi_radii_m` | Physical radii in metres for multiscale TPI. Default: 5 10 25 50 100 | See accepted syntax: `--multiscale_tpi_radii_m MULTISCALE_TPI_RADII_M [MULTISCALE_TPI_RADII_M ...], --multiscale-tpi-radii-m MULTISCALE_TPI_RADII_M [MULTISCALE_TPI_RADII_M ...]` |
| `--openness_radii_m` | Physical search radii in metres for positive/negative openness. Default: 5 10 25 50 100 | See accepted syntax: `--openness_radii_m OPENNESS_RADII_M [OPENNESS_RADII_M ...], --openness-radii-m OPENNESS_RADII_M [OPENNESS_RADII_M ...]` |
| `--twi_eps` | Small epsilon used in TWI computation for numerical stability. | See accepted syntax: `--twi_eps TWI_EPS, --twi-eps TWI_EPS` |
| `--dtw_max_distance` | Optional cap for DTW search distance. | See accepted syntax: `--dtw_max_distance DTW_MAX_DISTANCE, --dtw-max-distance DTW_MAX_DISTANCE` |

### FAST-CHANGE

| Parameter / accepted syntax | Function / definition | Configuration guidance |
|---|---|---|
| `--change_input_type` | Source raster family for FAST_CHANGE. | See accepted syntax: `--change_input_type {FAST_DEM,FAST_DSM,FAST_CHM,FAST_TERRAIN}, --change-input-type {FAST_DEM,FAST_DSM,FAST_CHM,FAST_TERRAIN}` |
| `--change_mode` | Change detection mode. | See accepted syntax: `--change_mode {pairwise,sequential,baseline}, --change-mode {pairwise,sequential,baseline}` |
| `--change_threshold` | Minimum threshold for gain/loss masks. | See accepted syntax: `--change_threshold CHANGE_THRESHOLD, --change-threshold CHANGE_THRESHOLD` |
| `--change_baseline_index` | Baseline raster index for baseline change mode. | See accepted syntax: `--change_baseline_index CHANGE_BASELINE_INDEX, --change-baseline-index CHANGE_BASELINE_INDEX` |
| `--change_source_subdir` | Optional specific subfolder for FAST_CHM or FAST_TERRAIN change detection. | See accepted syntax: `--change_source_subdir CHANGE_SOURCE_SUBDIR, --change-source-subdir CHANGE_SOURCE_SUBDIR` |
| `--change_sigma1` | Uncertainty term for the first raster/source in LOD computation. | See accepted syntax: `--change_sigma1 CHANGE_SIGMA1, --change-sigma1 CHANGE_SIGMA1` |
| `--change_sigma2` | Uncertainty term for the second raster/source in LOD computation. | See accepted syntax: `--change_sigma2 CHANGE_SIGMA2, --change-sigma2 CHANGE_SIGMA2` |
| `--change_lod_mode` | LOD strategy for FAST_CHANGE. | See accepted syntax: `--change_lod_mode {threshold_only,rss,max}, --change-lod-mode {threshold_only,rss,max}` |

### FAST-ITD

| Parameter / accepted syntax | Function / definition | Configuration guidance |
|---|---|---|
| `--itd_method` | ITD method for tree detection workflows. | See accepted syntax: `--itd_method {placeholder,lmf,watershed,adaptive_watershed,yun2021,dalponte2016,li2012,csp}, --itd-method {placeholder,lmf,watershed,adaptive_watershed,yun2021,dalponte2016,li2012,csp}` |
| `--itd_source_chm` | Optional CHM variant folder to use for ITD, e.g. pitfree or percentile_band. | See accepted syntax: `--itd_source_chm ITD_SOURCE_CHM, --itd-source-chm ITD_SOURCE_CHM` |
| `--itd_min_height` | Minimum canopy/surface height used for ITD eligibility. | See accepted syntax: `--itd_min_height ITD_MIN_HEIGHT, --itd-min-height ITD_MIN_HEIGHT` |
| `--itd_crown_window_m` | Approximate crown-detection window in map units used for local maxima search. | See accepted syntax: `--itd_crown_window_m ITD_CROWN_WINDOW_M, --itd-crown-window-m ITD_CROWN_WINDOW_M` |
| `--itd_min_peak_separation_m` | Minimum separation between retained treetop candidates in map units. | See accepted syntax: `--itd_min_peak_separation_m ITD_MIN_PEAK_SEPARATION_M, --itd-min-peak-separation-m ITD_MIN_PEAK_SEPARATION_M` |
| `--itd_angle_threshold_deg` | Valley-angle threshold used to prune likely false adjacent treetops. | See accepted syntax: `--itd_angle_threshold_deg ITD_ANGLE_THRESHOLD_DEG, --itd-angle-threshold-deg ITD_ANGLE_THRESHOLD_DEG` |
| `--itd_screen_max_pair_distance_m` | Maximum treetop-pair distance checked during false- peak screening. | See accepted syntax: `--itd_screen_max_pair_distance_m ITD_SCREEN_MAX_PAIR_DISTANCE_M, --itd-screen-max-pair-distance-m ITD_SCREEN_MAX_PAIR_DISTANCE_M` |
| `--itd_banded_neighborhood_px` | Half-width in pixels of the banded neighborhood sampled between adjacent treetop pairs. | See accepted syntax: `--itd_banded_neighborhood_px ITD_BANDED_NEIGHBORHOOD_PX, --itd-banded-neighborhood-px ITD_BANDED_NEIGHBORHOOD_PX` |
| `--itd_min_crown_area_m2` | Minimum crown area retained after raster crown delineation. | See accepted syntax: `--itd_min_crown_area_m2 ITD_MIN_CROWN_AREA_M2, --itd-min-crown-area-m2 ITD_MIN_CROWN_AREA_M2` |

### FAST-STRUCTURE

| Parameter / accepted syntax | Function / definition | Configuration guidance |
|---|---|---|
| `--structure_products` | FAST_STRUCTURE products to generate from normalized point clouds. | See accepted syntax: `--structure_products {all,canopy_cover,z_mean,z_max,z_sd,FHD,VCI,n_points} [{all,canopy_cover,z_mean,z_max,z_sd,FHD,VCI,n_points} ...], --structure-products {all,canopy_cover,z_mean,z_max,z_sd,FHD,VCI,n_points} [{all,canopy_cover,z_mean,z_max,z_sd,FHD,VCI,n_points} ...]` |
| `--structure_res` | Output raster resolution for FAST_STRUCTURE products. | See accepted syntax: `--structure_res STRUCTURE_RES, --structure-res STRUCTURE_RES` |
| `--structure_min_h` | Minimum normalized height considered vegetation for FAST_STRUCTURE metrics. | See accepted syntax: `--structure_min_h STRUCTURE_MIN_H, --structure-min-h STRUCTURE_MIN_H` |
| `--structure_bin_size` | Vertical bin size for FHD and VCI metrics. | See accepted syntax: `--structure_bin_size STRUCTURE_BIN_SIZE, --structure-bin-size STRUCTURE_BIN_SIZE` |
| `--canopy_thr` | Height threshold used for canopy cover. | See accepted syntax: `--canopy_thr CANOPY_THR, --canopy-thr CANOPY_THR` |
| `--canopy_mode` | Canopy-cover mode. | See accepted syntax: `--canopy_mode {all_points}, --canopy-mode {all_points}` |
| `--structure_na_fill` | Optional NA fill mode for FAST_STRUCTURE outputs. | See accepted syntax: `--structure_na_fill {none,3x3_mean}, --structure-na-fill {none,3x3_mean}` |

### FAST-TREECLOUDS

| Parameter / accepted syntax | Function / definition | Configuration guidance |
|---|---|---|
| `--treeclouds_las_source` | LAS source used by FAST_TREECLOUDS. Default: FAST_NORMALIZED | See accepted syntax: `--treeclouds_las_source {FAST_NORMALIZED,FAST_GC}, --treeclouds-las-source {FAST_NORMALIZED,FAST_GC}` |
| `--treeclouds_min_height` | Minimum point height retained during FAST_TREECLOUDS segmentation. | See accepted syntax: `--treeclouds_min_height TREECLOUDS_MIN_HEIGHT, --treeclouds-min-height TREECLOUDS_MIN_HEIGHT` |
| `--treeclouds_write_individual` | Also write individual per-tree/per-segment LAS files. | See accepted syntax: `--treeclouds_write_individual, --treeclouds-write-individual` |
| `--treeclouds_no_write_individual` | Disable individual per-tree/per-segment LAS writing. | See accepted syntax: `--treeclouds_no_write_individual, --treeclouds-no-write-individual` |

### Tiling

| Parameter / accepted syntax | Function / definition | Configuration guidance |
|---|---|---|
| `--tile_size_m` | Tile core size in meters for tiling workflows. | See accepted syntax: `--tile_size_m TILE_SIZE_M, --tile-size-m TILE_SIZE_M` |
| `--buffer_m` | Tile buffer size in meters for tiling workflows. | See accepted syntax: `--buffer_m BUFFER_M, --buffer-m BUFFER_M` |
| `--small_tile_merge_frac` | Merge planned tiles smaller than this fraction into a neighbor. | See accepted syntax: `--small_tile_merge_frac SMALL_TILE_MERGE_FRAC, --small-tile-merge-frac SMALL_TILE_MERGE_FRAC` |
| `--use_existing_tiles` | Treat input folder as already tiled data, build a manifest from existing tiles, and reuse them downstream without retiling. | See accepted syntax: `--use_existing_tiles, --use-existing-tiles` |
| `--cleanup_tiles` | Remove tiling workspace after successful merge. | See accepted syntax: `--cleanup_tiles, --cleanup-tiles` |
| `--overwrite_tiles` | Rebuild tiles even if a tile manifest already exists. | See accepted syntax: `--overwrite_tiles, --overwrite-tiles` |

### Other options

| Parameter | Function / definition | Accepted syntax |
|---|---|---|
| `--version` |  | `--version             show program's version number and exit` |

## 7.3 Documentation reliability rules

1. CLI-confirmed: syntax and descriptions reproduced from the supplied `fastgc --help`.
2. Source-verified: requires reading the corresponding implementation and regression tests.
3. Benchmark-verified: requires reproducible sensor/dataset execution logs and output validation.
4. Avoid universal “best settings” claims. Tile size, buffer, resolution, CHM methods and stream thresholds depend on sensor, density, terrain and purpose.
5. FAST-GIS has its own command interface (`src/fastgc/gis/gis_cli.py`); its subcommands are **not captured** by this root CLI help.
