# FAST-GIS → FAST-GC: Plot 005

The source ALS cloud was clipped into five circular plots using `fastgc gis --sampling random --plots 5 --shape circle --radius 15 --buffer 5 --seed 42` (buffer is illustrative and must be checked against the final successful run). The plot collection contains per-plot LAZ and `Clip_Plot_005.json` metadata. The `fastgc --workflow plots-run` command uses the collection root (`ALS_plots`) and writes products back into that collection; do not supply an unrelated `--out_dir`.

## Figure inventory

The uploaded files include two unlabelled standalone GeoTIFFs: their surface-elevation and canopy-height identities are **provisional**, not independently established. All terrain and structure raster labels come from ZIP archive paths. Figures show the valid raster pixels and their original georeferencing; no artificial circular crop is applied.

## Product descriptions

| Product | Function | Output |
|---|---|---|
| DSM (provisional) | Surface elevation | GeoTIFF, elevation m |
| CHM (provisional) | Height above terrain | GeoTIFF, height m |
| Slope | Terrain gradient | GeoTIFF, degrees |
| Aspect | Terrain orientation | GeoTIFF, degrees |
| Hillshade | Shaded terrain relief | GeoTIFF, relative illumination |
| TRI / roughness | Terrain heterogeneity | GeoTIFF, raster-specific units |
| TPI | Local relative elevation | GeoTIFF, raster-specific units |
| FHD / VCI | Vertical foliage/vegetation complexity | GeoTIFF, index values |
| Canopy cover | Canopy occupancy | GeoTIFF, check source definition for scaling |
| Height statistics | Vertical distribution | GeoTIFF, m where height-based |
| Geometric descriptors | Local point-cloud geometry | GeoTIFF, descriptor values |

See `plot005_product_inventory.csv` for individual source files, resolution, valid pixel counts and data ranges.
