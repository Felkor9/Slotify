## G

- [x] Applikationen ska ha ett frontend, ett backend och en databas.
- [x] Alla kodändringar måste föras in på main-branch:en minst en gång per “arbetsdag”. Detta kallas Continous Integration.
- [x] Alla måste individuellt publicera applikationen på sin egen server och dokumentera sin insats i rapporten.
- [x] Applikationen ska publiceras med Docker Compose. Ni kan samarbeta med att skapa Docker Compose-konfigurationen. Minst två services måste specificeras i compose.yaml. Frontend- och backend-delarna kan ingå i samma service men databasen måste vara en separat service. Tjänsterna kan startas med docker compose up -d. (-d-växeln kan ha betydelse eftersom tjänsterna annars kan stängas av när SSH-sessionen avslutas.)
- [ ] Alla måste delta i att förbättra prestandan i projektet och dokumentera sin insats i rapporten. För exempel på prestandaförbättringar, se modulen Några webboptimeringar.
- [x] Alla måste delta i attin insat göra projektet GDPR-kompatibelt och dokumentera ss i rapporten. För mer information om GDPR, se modulen GDPR och datasäkerhet.
- [x] Alla måste delta i att utveckla fullstack-applikationen och utföra frontend-, backend- och databasrelaterat arbete, och dokumentera sin insats i rapporten.
- [x] Projektet ska kunna behandla påhittade personuppgifter.
- [x] Upprätta som grupp ett register över behandlingen av (de påhittade) personuppgifterna i systemet. Använd gärna Integritetsskyddsmyndighetens checklista kring att föra register över behandling.
- [x] Gör det möjligt för användare att skapa konton eller på något annat sätt föra in personuppgifter i systemet. Informera användarna om vilka personuppgifter som hanteras och varför. Inkludera en integritetsskyddspolicy. Om samtycke används som laglig grund för personuppgiftshanteringen måste användaren aktivt samtycka till behandlingen. (Detta innebär att användaren måste göra valet att bocka i en kryssruta eller liknande.)
- [ ] Ge användarna möjligheten att komma åt, ändra och radera sina personuppgifter.
- [x] Alla måste bidra till det GDPR-relaterade arbetet och dokumenterar i sin insats i rapporten.
- [x] Databasen ska finnas kvar, och applikationen ska fortsätta fungera, även om docker compose down följt av docker compose up körs. För att uppnå detta kan databasens filer (/var/lib/postgresql/data i PostgreSQL-tjänsten) placeras på värdystemet (utanför Docker) med en volumes-deklaration. Detta förhindrar att databastabeller försvinner när docker compose down körs. Om PostgreSQL används och databastjänsten heter “database” går databasen att komma åt via docker compose exec database psql --username=postgres. (När PostgreSQL-tjänsten körs lokalt på en dator (alltså inte på en server), och Git Bash på Windows används, behöver winpty docker compose exec database psql --username=postgres användas.)
- [x] Omfattningen på projektet ska vara tillräckligt stor utifrån att projektet pågår i ungefär tre veckor.

## VG

- [x] Skapa en separat service för frontend-filerna som serverar frontend-gränssnittet via NGINX eller liknande. Skapa också en multi stage Docker build för ditt frontend, och ge ett Dockerfile-exempel, så att produktionsfilerna kan produceras. I en multi stage Docker build kan node användas i en stage, och nginx i en annan stage. Konfigurera ett proxy_pass-direktiv mot värdnamnet backend (istället för localhost eller 127.0.0.1). Använd också root-direktivet för att servera de statiska filerna. Exponera endast port 80 (eller port 443) i config.yaml. Beskriv hur du gjorde i rapporten.
- [x] Använd en .env-fil för att konfigurera PGURI- och POSTGRES_PASSWORD-miljövariablerna i Docker Compose. För mer information om hur .env-filer kan användas i Docker Compose, se Set environment variables within your container's environment. Notera att PostgreSQL-databasen kan behövas återskapas om POSTGRES_PASSWORD-variabeln inte är satt korrekt när databasen skapas. Beskriv hur du gjorde i rapporten.
- [x] Inkludera en SQL-fil, init.sql, som ska kunna användas för att lägga in ursprungliga data i databasen. Beskriv i rapporten hur docker compose cp kan användas för att kopiera över init.sql till databas-container:n och hur docker compose exec kan användas för att läsa in SQL-filens innehåll i databasen med psql.
