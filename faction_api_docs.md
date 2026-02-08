# Faction API Documentation

This document outlines the available Faction API endpoints, their schema definitions (from Torn OpenAPI), and current data coverage in our local database.

## applications

**API Endpoint:** `https://api.torn.com/v2/faction/applications`

**Summary:** Get your faction's applications

**Description:** Requires minimal access key with faction API access permissions. 


✅ **Data Available Locally** (Last Updated: 2026-02-07T07:02:30.535Z)

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `applications` | array |  | ✅ ([]...) |

---

## attacks

**API Endpoint:** `https://api.torn.com/v2/faction/attacks`

**Summary:** Get your faction's detailed attacks

**Description:** Requires limited access key with faction API access permissions. 


✅ **Data Available Locally** (Last Updated: 2026-02-07T10:36:34.881Z)

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `attacks` | array |  | ✅ ([{'id':445657138,'co...) |
| `_metadata` | object |  | ✅ ({'links':{'next':nul...) |

---

## attacksfull

**API Endpoint:** `https://api.torn.com/v2/faction/attacksfull`

**Summary:** Get your faction's simplified attacks

**Description:** Requires limited access key with faction API access permissions. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `attacks` | array |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## balance

**API Endpoint:** `https://api.torn.com/v2/faction/balance`

**Summary:** Get your faction's & member's balance details

**Description:** Requires limited access key with faction API access permissions. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `balance` | object |  | ❌ |

---

## basic

**API Endpoint:** `https://api.torn.com/v2/faction/basic`

**Summary:** Get your faction's basic details

**Description:** Requires public access key. 
 The 'is_enlisted' value will be populated if you have API faction permissions (with custom, limited or full access keys), otherwise it will be set as null.

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `basic` | object |  | ❌ |

---

## {id}/basic

**API Endpoint:** `https://api.torn.com/v2/faction/{id}/basic`

**Summary:** Get a faction's basic details

**Description:** Requires public access key. 
 The 'is_enlisted' value will be populated if you're requesting data for your faction and have faction permissions (with custom, limited or full access keys), otherwise it will be set as null.

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `basic` | object |  | ❌ |

---

## chain

**API Endpoint:** `https://api.torn.com/v2/faction/chain`

**Summary:** Get your faction's current chain

**Description:** Requires public access key. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `chain` | object |  | ❌ |

---

## {id}/chain

**API Endpoint:** `https://api.torn.com/v2/faction/{id}/chain`

**Summary:** Get a faction's current chain

**Description:** Requires public access key. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `chain` | object |  | ❌ |

---

## chains

**API Endpoint:** `https://api.torn.com/v2/faction/chains`

**Summary:** Get a list of your faction's completed chains

**Description:** Requires public access key. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `chains` | array |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## {id}/chains

**API Endpoint:** `https://api.torn.com/v2/faction/{id}/chains`

**Summary:** Get a list of a faction's completed chains

**Description:** Requires public access key. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `chains` | array |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## chainreport

**API Endpoint:** `https://api.torn.com/v2/faction/chainreport`

**Summary:** Get your faction's latest chain report

**Description:** Requires public access key. 
 This includes currently ongoing chains.

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `chainreport` | object |  | ❌ |

---

## {chainId}/chainreport

**API Endpoint:** `https://api.torn.com/v2/faction/{chainId}/chainreport`

**Summary:** Get a chain report

**Description:** Requires public access key. 
 Chain reports for ongoing chains are available only for your own faction.

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `chainreport` | object |  | ❌ |

---

## contributors

**API Endpoint:** `https://api.torn.com/v2/faction/contributors`

**Summary:** Get your faction's challenge contributors

**Description:** Requires limiteed access key with faction API access permissions. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `contributors` | array |  | ❌ |

---

## crimes

**API Endpoint:** `https://api.torn.com/v2/faction/crimes`

**Summary:** Get your faction's organized crimes

**Description:** Requires minimal access key with faction API access permissions. 
 It's possible to get older entries either by timestamp range (from, to) or with offset.
 Crimes are ordered depending on the category chosen:
 * For categories 'all' & 'available', the ordering field is 'created_at'.
 * For categories 'successful', 'failed' & 'completed', the ordering field is 'executed_at'.
 * For categories 'recruiting' & 'expired', the ordering field is 'expired_at'.
 * For category 'planning', the ordering field is 'ready_at'.

✅ **Data Available Locally** (Last Updated: 2026-02-07T10:59:33.069Z)

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `crimes` | array |  | ✅ ([{'id':1283675,'name...) |
| `_metadata` | object |  | ✅ ({'links':{'next':'ht...) |

---

## {crimeId}/crime

**API Endpoint:** `https://api.torn.com/v2/faction/{crimeId}/crime`

**Summary:** Get a specific organized crime

**Description:** Requires minimal access key with faction API access permissions. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `crime` | object |  | ❌ |

---

## hof

**API Endpoint:** `https://api.torn.com/v2/faction/hof`

**Summary:** Get your faction's hall of fame rankings.

**Description:** Requires public access key. 
 

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `hof` | object |  | ❌ |

---

## {id}/hof

**API Endpoint:** `https://api.torn.com/v2/faction/{id}/hof`

**Summary:** Get a faction's hall of fame rankings.

**Description:** Requires public access key. 
 

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `hof` | object |  | ❌ |

---

## members

**API Endpoint:** `https://api.torn.com/v2/faction/members`

**Summary:** Get a list of your faction's members

**Description:** Requires public access key. 
 The 'revive_setting' value will be populated (not Unknown) if you have faction permissions (with custom, limited or full access keys), otherwise it will be set as 'Unknown'.

✅ **Data Available Locally** (Last Updated: 2026-02-07T10:59:33.000Z)

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `members` | array |  | ✅ ([{'id':66236,'name':...) |

---

## {id}/members

**API Endpoint:** `https://api.torn.com/v2/faction/{id}/members`

**Summary:** Get a list of a faction's members

**Description:** Requires public access key. 
 The 'revive_setting' value will be populated (not Unknown) if you're requesting data for your own faction and have faction permissions (with custom, limited or full access keys), otherwise it will be set as 'Unknown'.

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `members` | array |  | ❌ |

---

## news

**API Endpoint:** `https://api.torn.com/v2/faction/news`

**Summary:** Get your faction's news details

**Description:** Requires minimal access key with faction API access permissions. 
 It is possible to pass up to 10 categories at the time (comma separated). Categories 'attack', 'depositFunds' and 'giveFunds' are only available with 'Custom', 'Limited' or 'Full' access keys.

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `news` | array |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## positions

**API Endpoint:** `https://api.torn.com/v2/faction/positions`

**Summary:** Get your faction's positions details

**Description:** Requires minimal access key with faction API access permissions. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `positions` | array |  | ❌ |

---

## rackets

**API Endpoint:** `https://api.torn.com/v2/faction/rackets`

**Summary:** Get a list of current rackets

**Description:** Requires public access key. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `rackets` | array |  | ❌ |

---

## {raidWarId}/raidreport

**API Endpoint:** `https://api.torn.com/v2/faction/{raidWarId}/raidreport`

**Summary:** Get raid war details

**Description:** Requires public access key. 
 

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `raidreport` | array |  | ❌ |

---

## raids

**API Endpoint:** `https://api.torn.com/v2/faction/raids`

**Summary:** Get raids history for your faction

**Description:** Requires public access key. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `raids` | array |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## {id}/raids

**API Endpoint:** `https://api.torn.com/v2/faction/{id}/raids`

**Summary:** Get a faction's raids history

**Description:** Requires public access key. 
 

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `raids` | array |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## rankedwars

**API Endpoint:** `https://api.torn.com/v2/faction/rankedwars`

**Summary:** Get ranked wars history for your faction

**Description:** Requires public access key. 
 Use offset to get older results which are always ordered descending.

✅ **Data Available Locally** (Last Updated: 2026-02-07T10:57:31.301Z)

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `rankedwars` | array |  | ✅ ([{'id':36725,'end':0...) |
| `_metadata` | object |  | ✅ ({'links':{'next':nul...) |

---

## {id}/rankedwars

**API Endpoint:** `https://api.torn.com/v2/faction/{id}/rankedwars`

**Summary:** Get a faction's ranked wars history

**Description:** Requires public access key. 
 Use offset to get older results which are always ordered descending.

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `rankedwars` | array |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## {rankedWarId}/rankedwarreport

**API Endpoint:** `https://api.torn.com/v2/faction/{rankedWarId}/rankedwarreport`

**Summary:** Get ranked war details

**Description:** Requires public access key. 
 

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `rankedwarreport` | object |  | ❌ |

---

## reports

**API Endpoint:** `https://api.torn.com/v2/faction/reports`

**Summary:** Get faction reports

**Description:** Requires limited access key. 

 *  The default limit is set to 25. However, the limit can be set to 100 for the 'stats' category.

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `reports` | array |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## revives

**API Endpoint:** `https://api.torn.com/v2/faction/revives`

**Summary:** Get your faction's detailed revives

**Description:** Requires limited access key with faction API access permissions. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `revives` | array |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## revivesFull

**API Endpoint:** `https://api.torn.com/v2/faction/revivesFull`

**Summary:** Get your faction's simplified revives

**Description:** Requires limited access key with faction API access permissions. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `revives` | array |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## search

**API Endpoint:** `https://api.torn.com/v2/faction/search`

**Summary:** Search factions by name or other criteria

**Description:** Requires public access key. 
This selection is standalone and cannot be used together with other selections.

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `search` | array |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## stats

**API Endpoint:** `https://api.torn.com/v2/faction/stats`

**Summary:** Get your faction's challenges stats

**Description:** Requires minimal access key with faction API access permissions. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `stats` | array |  | ❌ |

---

## territory

**API Endpoint:** `https://api.torn.com/v2/faction/territory`

**Summary:** Get a list of your faction's territories

**Description:** Requires public access key. 


✅ **Data Available Locally** (Last Updated: 2026-02-07T07:02:30.524Z)

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `territory` | array |  | ✅ ([]...) |

---

## {id}/territory

**API Endpoint:** `https://api.torn.com/v2/faction/{id}/territory`

**Summary:** Get a list of a faction's territories

**Description:** Requires public access key. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `territory` | array |  | ❌ |

---

## territoryownership

**API Endpoint:** `https://api.torn.com/v2/faction/territoryownership`

**Summary:** Get a list territory ownership

**Description:** Requires public access key. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `territoryOwnership` | array |  | ❌ |

---

## territorywars

**API Endpoint:** `https://api.torn.com/v2/faction/territorywars`

**Summary:** Get territory wars history for your faction

**Description:** Requires public access key. 


✅ **Data Available Locally** (Last Updated: 2026-02-07T07:42:31.225Z)

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `territorywars` | array |  | ✅ ([{'id':43233,'end':1...) |

---

## {id}/territorywars

**API Endpoint:** `https://api.torn.com/v2/faction/{id}/territorywars`

**Summary:** Get a faction's territory wars history

**Description:** Requires public access key. 
 

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `territorywars` | array |  | ❌ |

---

## {territoryWarId}/territorywarreport

**API Endpoint:** `https://api.torn.com/v2/faction/{territoryWarId}/territorywarreport`

**Summary:** Get territory war details

**Description:** Requires public access key. 
 

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `territorywarreport` | array |  | ❌ |

---

## upgrades

**API Endpoint:** `https://api.torn.com/v2/faction/upgrades`

**Summary:** Get your faction's upgrades

**Description:** Requires minimal access key with faction API access permissions. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `upgrades` | object |  | ❌ |
| `state` | object |  | ❌ |

---

## warfare

**API Endpoint:** `https://api.torn.com/v2/faction/warfare`

**Summary:** Get faction warfare

**Description:** Requires public access key. 
The response depends on the selected category.

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `warfare` | object |  | ❌ |
| `_metadata` | object |  | ❌ |

---

## wars

**API Endpoint:** `https://api.torn.com/v2/faction/wars`

**Summary:** Get your faction's wars & pacts details

**Description:** Requires public access key. 
 

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `pacts` | array |  | ❌ |
| `wars` | object |  | ❌ |

---

## {id}/wars

**API Endpoint:** `https://api.torn.com/v2/faction/{id}/wars`

**Summary:** Get a faction's wars & pacts details

**Description:** Requires public access key. 
 

❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `pacts` | array |  | ❌ |
| `wars` | object |  | ❌ |

---

## lookup

**API Endpoint:** `https://api.torn.com/v2/faction/lookup`

**Summary:** No summary

**Description:** Requires public access key. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `selections` | array |  | ❌ |

---

## timestamp

**API Endpoint:** `https://api.torn.com/v2/faction/timestamp`

**Summary:** Get current server time

**Description:** Requires public access key. 


❌ **No Data Locally**

### Field Schema

| Field | Type | Description | Sample Validated? |
|---|---|---|---|
| `timestamp` | integer |  | ❌ |

---

