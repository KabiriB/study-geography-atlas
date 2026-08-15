# Methods and privacy

## Research purpose

The Study Geography Atlas is a descriptive cartographic layer. It situates survey fieldwork across nine study neighbourhoods in three cities. It is not an analytical model, an official boundary dataset, or an individual tracking system.

## Denominator ledger

The supplied project materials contain several legitimate but different denominators:

| Stage | Cases | Interpretation |
|---|---:|---|
| Raw survey cases reported for the wider project | 1,644 | Starting survey total reported in project documentation |
| Geocoded records represented in the uploaded Atlas source | 1,643 | Geography source supplied with the v3.2 package |
| Clear city-level coordinate anomalies excluded from the public map | 5 | Four aggregate source rows representing five interviews |
| Interviews represented in this public Atlas | 1,638 | Public mapped denominator |
| Analytical sample used in One Life, Many Geographies | 1,623 | Separately cleaned analytical denominator |

The geography and analytical denominators should not be forced to match. The Atlas asks where fieldwork records can be represented safely and plausibly; the companion interface applies its own validity and analytical-sample rules.

The uploaded materials do not document why the geocoded Atlas source contains one fewer record than the 1,644 raw survey cases. That one-record difference requires confirmation from the original data preparation history, but it does not alter the public Atlas total of 1,638 derived from the supplied geography source.

## Coordinate QA

The public release applies broad city-level coordinate windows as QA guardrails. These windows identify obvious cross-city or geographically implausible coordinate assignments. They are not analytical boundaries.

Five interviews were excluded from the public map because their coordinates fell outside the broad window of the city to which they were assigned. The excluded rows are not included in this repository.

The uploaded source code also contained a stricter, undocumented distance-from-site-centre rule that would have hidden 24 interviews. That rule was removed from the public release because it did not match the accompanying methods documentation and could classify plausible fieldwork variation as an error.

## Public aggregation

The release data were created from the previously rounded/grouped public geography supplied in the uploaded package. Exact coordinates were not used.

The public transformation applies the following controls:

1. Exclude the five clear city-level coordinate anomalies.
2. Aggregate the remaining public coordinates to an initial 0.005-degree grid.
3. Within each study neighbourhood, merge grid cells representing fewer than five interviews into the nearest retained aggregate cell.
4. Confirm that every displayed point represents at least five interviews.
5. Publish only city, neighbourhood, country, aggregate latitude, aggregate longitude, and interview count.

Displayed coordinates are therefore map anchors for aggregate groups. They must not be interpreted as exact interview locations, household locations, or route traces.

## Fieldwork footprints

The interface calculates a convex hull around the displayed aggregate points for each study neighbourhood. These hulls describe the visible spread of fieldwork. They are not:

- official or administrative boundaries;
- legal definitions;
- locally recognised neighbourhood limits;
- measures of neighbourhood size;
- complete representations of unsurveyed areas.

## Public repository exclusions

The repository contains no:

- respondent identifiers or names;
- respondent-level attributes;
- exact respondent coordinates;
- interviewer identifiers;
- precise interview timestamps;
- raw survey records;
- individual route traces;
- protected coordinate QA examples;
- internal data exports.

## Limitations

Spatial aggregation reduces disclosure risk but also reduces locational precision. The map should support orientation and research-design communication, not fine-grained spatial inference. Basemap content comes from third-party providers and may change independently of the research data.
