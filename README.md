# STAR news website
Star news it's a simple news website using minimalistic design approach.

### Site is available on cyclic - [https://nervous-housecoat-ray.cyclic.app/](https://nervous-housecoat-ray.cyclic.app/)

[Mock-up of a website](https://www.figma.com/file/VFV6QQuNU1w5JqpqnhWZ6K/STAR-NEWS?node-id=0%3A1&t=jpuge5ojJ0pitfiY-1)

## Main functions:
1. Authorisation for allowed editor-users (via generated login and password from admin)
2. Admin-panel (editing allowed topics to post news for each editor-user)
3. WYSIWYG* (What You See Is What You Get) news creation
4. WYSIWYG* news editing (editor-user can edit only own news, admin can edit all posts)
5. Weather widget on all news section pages
6. Views counting for each article (storing unique IPs in database)
<sub>*WYSIWYG example - https://habr.com/ru/docs/help/wysiwyg/ </sub>

## Tech stack:
- Self-implemented Node.js server
- Pure JS, CSS with no frameworks
- Simple self-implemented HTML-templates (adding hidden html field and via url parsing) 

![image](https://user-images.githubusercontent.com/36516154/225355953-cf106f13-6aeb-4076-8e2e-ef5bda495f52.png)

Data models:
- User (login - password - permissions - admin);
- Posts (title - body - topic - ips - views - timestamp);
