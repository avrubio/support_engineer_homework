-- Write SQL queries to return:
-- How many organizations do not have account plans?
SELECT COUNT(*) AS organizations_without_account_plans
FROM organization_orm AS o
LEFT JOIN account_plan_orm AS a ON o.id = a.organizationId
WHERE a.id IS NULL;


-- How many organizations have more than one account plan?
SELECT o.id AS organization_id, COUNT(a.id) AS num_account_plans
FROM organization_orm AS o
LEFT JOIN account_plan_orm AS a ON o.id = a.organizationId
GROUP BY o.id
HAVING num_account_plans > 1;


-- List all organizations that have only one account plan.
SELECT o.id AS organization_id, COUNT(a.id) AS num_account_plans
FROM organization_orm AS o
LEFT JOIN account_plan_orm AS a ON o.id = a.organizationId
GROUP BY o.id
HAVING num_account_plans = 1;

-- List all organizations that have the PASSWORDLESS feature set to true.
SELECT * 
FROM account_plan_orm 
WHERE JSON_UNQUOTE(JSON_EXTRACT(features, '$.PASSWORDLESS')) = 'true';