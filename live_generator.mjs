import { request, gql } from 'graphql-request';
import * as QRcode from 'qrcode'

const competitionId = 'PickeringFallA2023'
const liveEndpoint = 'https://live.worldcubeassociation.org/api';

const fetchLivePersonId = async (compId) => {
  const query = gql`
    query Competition($competitionId: ID!) {
      competition(id: $competitionId) {
        id
        competitors {
          id
          name
        }
      }
    }
  `;
  const data = await request(liveEndpoint, query, {
    competitionId: compId,
  });
  return data.competition.competitors;
}

const fetchLiveCompId = async (name) => {
  const query = gql`
  query Competitions($filter: String!) {
    competitions(filter: $filter, limit: 10) {
      id
      name
    }
  }
  `;
  const data = await request(liveEndpoint, query, {
    filter: name,
  });
  for (const competition of data.competitions) {
    if (competition.name === name) {
      return competition.id;
    }
  }
  return undefined;
}

const get_wcif = async () => {
  const response = await fetch(`https://worldcubeassociation.org/api/v0/competitions/${competitionId}/wcif/public`);
  const data = await response.json();
  return data;
}

const generateQR = async (text) => {
  try {
    console.log(await QRcode.toString(text))
  } catch (err) {
    console.error(err)
  }
}

const wcif = await get_wcif();
const liveCompId = await fetchLiveCompId(wcif.name);
const persons = await fetchLivePersonId(liveCompId);
console.log(persons);
for (const person of persons) {
  const liveURL = `https://live.worldcubeassociation.org/competitions/${liveCompId}/competitors/${person.id}`
  console.log(person.name);
  await generateQR(liveURL);
}