# Data manifest

This repository contains only the following public-release data files. All paths are relative to `public/data/`.

| File | Contents | Public-release basis |
|---|---|---|
| `survey_points_public.json` | 104 aggregate map anchors representing 1,638 interviews | Contains only city, neighbourhood, country, aggregate coordinates, and count; every point represents at least five interviews |
| `survey_points_public.csv` | Tabular equivalent of the JSON point layer | Same aggregate-only fields and disclosure controls |
| `study_site_metadata.json` | One row for each of nine study neighbourhoods | Aggregate counts, aggregate centres, and display bounds only |
| `city_metadata.json` | One row for each of three cities | Aggregate counts, aggregate centres, display bounds, and neighbourhood names only |
| `study_geography_manifest.json` | Release policy, denominators, aggregation rules, and file list | Contains methodological metadata and no respondent-level information |

## Excluded from the repository

The public package does not contain exact coordinates, respondent IDs, names, interviewer identifiers, precise timestamps, raw survey records, protected QA examples, or respondent-level attributes.

## Data totals

- Cities: 3
- Study neighbourhoods: 9
- Aggregate map points: 104
- Interviews represented: 1,638
- Minimum interviews represented by one point: 5

## Checksums

SHA-256 checksums allow co-authors to confirm that release files have not changed.

| File | Bytes | SHA-256 |
|---|---:|---|
| `survey_points_public.json` | 14,872 | `1cf09f3b5aab13beff8cef742af30ec1930e11259776330cbc35146e39dc7f99` |
| `survey_points_public.csv` | 4,303 | `689cdc71152dc06afa4fab1f8b83d57512d704078893e7dd927e686a10de24b8` |
| `study_site_metadata.json` | 3,046 | `0c3e11fbb8b9fcc2a131925bc174bd1e297e568eefdc0819fe59e2b036f81379` |
| `city_metadata.json` | 1,175 | `60494963b1394673759f29e1842471826b202efb0c7ce7723dfef96d9ec12b88` |
| `study_geography_manifest.json` | 2,068 | `90e966e8d7d5f561b95ab10709be44d5056df4fc993aaa81f6e4607718426a33` |

## Interpretation warning

Displayed coordinates are aggregate map anchors. They are not exact interview, household, or respondent locations. Fieldwork-footprint hulls generated from these anchors are descriptive and are not official neighbourhood boundaries.
