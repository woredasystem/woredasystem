# Complaint Escalation System - 5 Days

## Escalation Timeline

All complaints now escalate every **5 days** (changed from 10 days) if not resolved.

### Level 1: Department Heads (Days 1-5 from submission)
- **Trade Office Head** (ግርማ በቀለ) - 5 days to respond
- **Labor & Skills Head** (ሻውል ታደሰ) - 5 days to respond  
- **Civil Registration Head** (ጋዲሳ ኢሉኩ) - 5 days to respond
- **If no response after 5 days** → Escalate to Level 2

### Level 2: CEO Office Head (Days 6-10 from Level 1 escalation)
- **CEO Office Head** (ለሊሳ ሲሪካ) - 5 days to respond from when it reached this level
- **If no response after 5 days** → Escalate to Level 3

### Level 3: Chief Executive (Days 11-15 from Level 2 escalation)
- **Chief Executive** (ጫልቱ አያና) - 5 days to respond from when it reached this level
- **If no response after 5 days** → Escalate to Level 4

### Level 4: Council (Days 16-20 from Level 3 escalation)
- **Council Speaker** (በየነች አንበሱ) - Final level

## Total Maximum Timeline
- **Day 1**: Complaint submitted to Department Head
- **Day 6**: Escalated to CEO Office Head (if not resolved)
- **Day 11**: Escalated to Chief Executive (if not resolved)
- **Day 16**: Escalated to Council (if not resolved)

## Database Function
The `escalate_complaints()` function runs daily via cron job and automatically escalates complaints that are:
- Not resolved (`status != 'Resolved'`)
- Older than 5 days (`created_at < NOW() - INTERVAL '5 days'`)
- Not at maximum level (`escalation_level < 4`)



