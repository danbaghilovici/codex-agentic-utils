# HLD title

- Status: Proposed
- Date: 2026-02-09
- Authors: dan@danbaghilovici.dev
- Tags: vision, product, architecture, roadmap
- Supersedes: None
- Superseded by: None

# DELETE THIS SECTION WHEN YOU START WORKING ON A DOCUMENT

## How to use this document

This document is a template for any design work you may be doing. It contains ideas for different sections you may want to have in your design document.

For each section you will find a textbox with explanation about its purpose and some ideas about what you may want to put inside. These explanations are more of a guidance than a rule, they are there to give you ideas, not to limit you. Once you're done working with the section, don't forget to remove the textbox.

Try to aim for 6-10 page document length (excluding appendices). First two pages are introduction (everything up to the High-level design section). HLD section would typically be ~4 pages, and remaining 4 pages would be taken up by technical implementation details about dependencies, APIs, data schemas, etc. If the document ends up being more than 10 pages, consider splitting it into different solution design documents or deferring some of details to the low-level design document.

## How to structure the design process

It's never too early to start the design process. As soon as you get initial input from your BAs/POs, it's already a good time to start working on the design document. Some important details:

1. Anyone can own the design document. It would typically be a senior/lead developer, but it doesn't really matter. What matters is that you as a team reach a consensus about the design.
2. Try to review/vet/approve the design with the technical team before getting to a stage when you need to estimate/split technical tasks. It helps a lot to have a good understanding of how you want to do something before getting into implementation details.
3. If your design crosses the boundary of your team responsibilities, it's highly recommended to involve anyone from the architecture team in your reviews. Otherwise use your own discretion, but keep in mind that architecture team is always there to help you and guide you through the process if necessary.
4. Word document is a medium for discussions. Use the "Comments" functionality of MS Word to help structure your design review meetings and drive the improvement process.
5. Final design should be in Confluence. Once design is approved by team/architects,
   a. Upload the final design to Confluence using "Import" functionality
   b. Include link to the Confluence page to the top of the document
   c. Put "Deprecated" watermark on the Word document and lock it for editing

## Useful tools

- Use mermaid (https://mermaid.js.org/) for architectural diagrams.

---

# Introduction

## Abstract

This section should sum up the purpose of project you're working on in three paragraphs or less. This should give reader enough context to understand what the design is trying to cover and main motivation behind it.

**Example:**

ESG solution is targeted to plan, assess, disclose, and report company's environmental, social, and governance impact. To cover these needs, financial and non-financial data must be collected, stored and aggregated.

In upcoming years ESG reporting is becoming mandatory for all companies on EU market (and on other markets as well). This opens great opportunities for Dataris that can offer end-to-end process coverage. With Amana's acquisition, it is possible to become one of the leading ESG software providers with a unique selling proposition on the market.

## Glossary

This section gives reader information about any terminology they might not be familiar with. If you're using any acronyms in the document – please put definitions here. If there is any terminology that readers might not be familiar with – please also put definitions here. In general, it's better to have this section as comprehensive as possible to avoid misunderstandings.

**Example:**

ESRS: European Sustainability Reporting Standards – Specific implementation of ESG reporting applicable for EU companies

## Tenets

Tenets are an ordered list of statements that drive the decision making. When talking about any decision in the design document, you should be able to trace it back to the tenets, saying that "I chose approach X, because we have defined tenet Y". Tenets are an extension of Dataris values. They specify how values apply specifically to this particular solution.

**Example:**

- Data collection is the key element of Dataris.ESG solution. We prioritize convenience of data collection for end users over convenience of configuration, maintainability, and performance.
- Dataris.ESG solution promotes the usage and drives adoption of Dataris.WebClient. Serving as a face of Dataris.WebClient offering, it must provide excellent user experience.

## Functional requirements

Functional requirements describe, on a high level, what the solution should do without detailing how it should do it. Typically, formulating them would be a responsibility of a business analyst or requirements engineer.

Everything in design document should be traceable to a specific functional or non-functional requirement. If you find yourself describing something that does not map to requirements, you're either (a) Missing a requirement, or (b) Creating design for a wrong problem.

**Example:**

- Dataris.ESG allows Dataris customers to collect sufficient data for ESG reporting in a convenient way
- Dataris.ESG solution provides a questionnaire template that is based on ESRS guidelines and is fine-tuned by Dataris consultants to make most sense to customers
- Dataris.ESG solution allows deep configuration of questionnaires on per-customer basis

## Out of scope functional requirements

This section is optional, but sometimes there are requirements that are not covered by a design but influence some of the decisions made. It's very useful to put them in this section.

**Example:**

- Dataris.ESG solution collects data separately (in-parallel) for different entities within customer org structure
- Several ESG collection cycles can be active at the same time for any given tenant
- Dataris.ESG solution supports collaboration/simultaneous filling of questionnaires to a reasonable degree

## Non-functional requirements

Non-functional requirements give you details about security, performance, maintainability, and other non-functional characteristics of the system. Some things to mention here:

1. Performance characteristics. Is your system expected to handle high load? What's the expected throughput? What are the maximum tolerable latency characteristics?
2. Scalability characteristics. Is it mandatory for your system to be able to scale horizontally? What's the limit for vertical scalability?
3. Security. What is the sensitivity of data you process? What are the storage/processing requirements with regard to data security?
4. Authentication/authorization. Who are the users of your system? How are they authenticated? Do you have requirements to limit access to certain functionality or to certain slice of data based on user/role?

Anything that informs decisions about the system from non-functional perspective should be represented here in this section. Please avoid mentioning specific solutions/technologies here, and list only requirements.

## User journeys in scope

This section helps you understand which user journeys are covered by the design doc. This is not a proper place for details of user journeys – it should reference user journeys defined elsewhere. Preferably, user journeys should be already defined in Confluence.

**Example:**

- Questionnaire setup on Dataris side (covered implicitly)
- Initial configuration of Dataris.ESG module for customer
- Questionnaire setup on customer side
  - Double materiality assessment matrix creation
  - Per-entity questionnaire configuration

## User journeys out of scope

This section explicitly outlines user journeys that are not covered by the design doc and are outside of scope, to avoid ambiguity during discussions.

**Example:**

- GHG calculation
- Data Aggregation
- Data Disclosure
- Reporting

---

# Overview of existing/related solutions

This is one of the most important sections of the document.

For any given problem, there is a good chance that you're not the first one trying your hand at it. Document your research here. Describe solutions that already exist within Dataris and outside the company, and how what you're suggesting is different/better than them.

---

# High-level design

This is the main body of the document. Here you detail your solution, the "How" of the problem. Ideally, you should have at least two sufficiently different alternative approaches before the first round of discussion.

## Approach 1 (recommended): name

Describe your approach 1. Few pointers:

1. Use diagrams to illustrate your approach. Depending on the level of your design, some diagrams to consider are:
   a. Infrastructure diagram
   b. Component diagram
   c. Data flow diagram
2. Describe each component in sufficient detail. Don't go into implementation level but give sufficient amount information to resolve ambiguity at low-level design stage.
3. Sum up in a few words why you would recommend this approach over alternative(s)

## Approach 2 (alternative): name

Describe your approach 2. Few pointers:

1. Use diagrams to illustrate your approach. Depending on the level of your design, some diagrams to consider are:
   a. Infrastructure diagram
   b. Component diagram
   c. Data flow diagram
2. Describe each component in sufficient detail. Don't go into implementation level but give sufficient amount information to resolve ambiguity at low-level design stage.
3. Sum up in a few words why you would recommend this approach over alternative(s)

## Approach n (alternative): name

Describe your approach n. Few pointers:

1. Use diagrams to illustrate your approach. Depending on the level of your design, some diagrams to consider are:
   a. Infrastructure diagram
   b. Component diagram
   c. Data flow diagram
2. Describe each component in sufficient detail. Don't go into implementation level but give sufficient amount information to resolve ambiguity at low-level design stage.
3. Sum up in a few words why you would recommend this approach over alternative(s)

## Cost considerations

Do a best-effort estimation of your approach. Consider what is the:

1. Fixed cost impact: How much would it cost us when the solution is idle, even if there are no onboarded tenants (per tenant pool if applicable)
2. Per-tenant impact. How much would it cost per onboarded tenant even when they are not actively using the solution
3. Runtime impact. How much it would cost us to run the solution at maximum productive load.

Consider how different proposed approaches compare to each other cost-wise

---

**STOP. Before proceeding with the document further, have an initial design review with your team to agree on an approach.**

After discussion is concluded, leave only chosen approach here; move all alternative approaches to the appendix, then continue working on the rest of the document.

---

# Dependencies

Your solution does not exist in vacuum. It interacts with different systems. Describe them here, mention if they are internal (Dataris-owned) or external dependencies (e.g. 3-rd party API). Describe what dependencies do, how you're planning to use them, their impact on your solution, and, importantly, your solution impact on dependencies. Do your dependencies need to scale up to support your solution? Do you need some work to be done by other teams? This is the place to list it.

---

# Implementation

## API Endpoints

If you're introducing any new APIs, describe them here. Don't be afraid to be too technical, it's fine to define API contracts to the level of individual fields here.

Describe what each new endpoint does– this is going to be the initial documentation for endpoints.

## Data schemas

If you're storing any data at all, describe the storage schemas here. Give a high-level diagram, then describe storage in more detail – go to individual field level if necessary

## Backwards compatibility

List here any constraints around backwards compatibility and how you plan to address them, including any step that must be manually executed during/after a deployment in order to preserve backwards compatibility of your application.

Think here of any data inconsistency that might appear if you are changing data schema or any communication issues that might appear if you change the API contract between components (such as BE and FE or different solutions).

## Limitations

Your solution would inevitably have limitations – describe them here. Some things to consider:

1. Max throughput
2. CPU/Memory limits
3. Storage limitations
   a. What's the max storage size?
   b. What's max item size?
   c. Any other specifics?

If you're using any AWS services, do go through their "Limits" page (example for AWS Lambda) and list anything that may be applicable here – max memory, max degree of parallelization, limits on execution time, etc.

If any limits are potentially impacting the solution, outline the scope of impact and potential mitigation strategy.

## Testing approach

Outline testing approach here. Collaborate with QAs to work on this section. Try to document answers at least to the following questions:

How much of the solution can be unit-tested? Do you deviate from Dataris-wide targets for any reason?

Are there API tests that can be built? If no, why?

Do you need integration tests? What is the approach to mocking dependencies?

Do you have UI? How is it tested? What must be automated, which tests are better left manual?

Do you need non-functional tests? Static/dynamic security scans? Performance tests?

Write it all here.

---

# Site Reliability/production support

Ideally, your solution should be written with an intent of being used in production. This is the section that outlines key aspects of solution deployment and monitoring.

## CI/CD

Only specify if you deviate from the recommended CI/CD solution. Give information about why you chose to do so.

## Scaling / Performance

How does your solution scale? Does it do vertical scaling automatically? Does it scale horizontally? Is automatic scale-in possible? Consider different components and whether them hitting scaling limits would throttle the solution.

## Monitoring

What are the principal metrics for your solution? What do you need to monitor? When do you want to be alarmed, and in which case do you need to wake up the SRE engineers in the middle of the night?

Do you have any kind of queue? Do you want to be alarmed on its size, or max age of messages? Do you return 4xx and 5xx errors to customers? What is the impact when you do? Do you scale up/down? What happens if you over/underscale and how do you monitor that? Try to answer these questions here.

Some examples:

- When API returns any 5xx error, this should result in an alert
- When there are more than 5% 5xx errors in a 5-minute time period, an SRE engineer should be paged

## Backup, Recovery, and data retention

How is your data backed up? How do you restore it? What happens in case of critical data loss? For how long do you need to retain your data, and what happens when you no longer need it? Do you need hot/cold storage? What do you do when you run out of space for data? Cover it here.

---

# FAQ

Try to think about parts of your solution that could prompt questions and address these questions ahead of time. Most of them should already be covered by different sections of this document, but there are always some small things that cannot be categorized.

**Example:**

Q: What is the advantage of using JSON representation of XBRL as a base format for questionnaire as opposed to defining our own format?

A: While inventing our own format would potentially make configuration more flexible, it brings in a new set of problems. Instead of implementing a subset of XBRL specification, we will have to define everything, including field types, from scratch. In addition to that, using JSON representation of XBRL improves reusability of both overrides and of the solution itself.

---

# Appendix

Appendix is a place for everything that is not strictly a part of your solution design, but you still want to reference in the document. Some of the things you want to include here:

- Specifications or links to specifications
- Market research
- UX/UI details

One more thing that would always be in the appendix is the rejected approaches – they're kept here for reference.
