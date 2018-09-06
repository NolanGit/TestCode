sonarServer = '123'
dashboardId = '456'
tmpurl = sonarServer + "/api/measures/component?additionalFields=metrics&componentKey=" \
    + dashboardId + "&metricKeys=bugs%2Cnew_bugs'"
print(tmpurl)
