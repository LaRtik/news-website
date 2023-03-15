# STAR news website
Star news it's a simple news website using minimalistic design approach.

[Mock-up of a website](https://www.figma.com/file/VFV6QQuNU1w5JqpqnhWZ6K/STAR-NEWS?node-id=0%3A1&t=jpuge5ojJ0pitfiY-1)

## Main functions:
1. Authorisation for allowed editor-users (via generated login and password from admin or via VK / Google)
2. Admin-panel (editing allowed topics to post news for each editor-user)
3. WYSYSYG (What You See Is What You Get) news creation
4. WYSYSYG news editing (editor-user can edit only own news, admin can edit all posts)
5. Simple recomendation system (based on cookies)

![image](https://user-images.githubusercontent.com/36516154/225355953-cf106f13-6aeb-4076-8e2e-ef5bda495f52.png)

Data models:
- Admin (Login - Password)
- News editor (Login - Password - Allowed Topics)
- User (cookies-based)
