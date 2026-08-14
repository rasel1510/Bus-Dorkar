# System Engineering & Performance Guidelines

1. **Industry-Level Scale**: Always keep in mind that this is an industry-level software system used daily by millions of users. Code for high concurrency, fault tolerance, and zero downtime.
2. **Minimal Data & Lowest Space Complexity**: Strictly minimize data transfer over the wire so the application consumes the lowest possible MBs of mobile internet. Keep payload sizes $O(1)$ and under 300 bytes.
3. **Lowest Time Complexity**: Ensure lowest time complexity ($O(1)$ lookups, indexed queries, zero-delay synchronous hydration) so the software renders everything instantly.
4. **Professional & Careful Execution**: Perform all changes carefully and professionally. Enforce strict security (XSS, CSRF, ReDoS, SQLi, DoS password length limits) and maintain high code quality standards.
