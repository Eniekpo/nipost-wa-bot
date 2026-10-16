// src/services/whatsappBotService.js

const BASE_URL = "https://api.postcode.gov.ng/v1";

export const NIPOST_SANDBOX_DB = {
  "LA-11-W06-TC-10": {
    postcode: "LA-11-W06-TC-10",
    valid: true,
    administrative_address: {
      state_name: "LAGOS",
      lga_name: "IKEJA",
      locality_name: "IKEJA GRA",
      zone: "SOUTH WEST",
    },
    recent_house_address: {
      recent: "14 ISAAC JOHN STREET, IKEJA GRA, LAGOS",
    },
    building_use_status: "residential",
    coordinates: { lat: 6.5818, lng: 3.3568 },
  },
  "LA-11-W06-TC-18": {
    postcode: "LA-11-W06-TC-18",
    valid: true,
    administrative_address: {
      state_name: "LAGOS",
      lga_name: "IKEJA",
      locality_name: "IKEJA GRA",
      zone: "SOUTH WEST",
    },
    recent_house_address: {
      recent: "28 JOEL OGUNNAIKE STREET, IKEJA GRA, LAGOS",
    },
    building_use_status: "commercial",
    coordinates: { lat: 6.5842, lng: 3.3591 },
  },
  "FC-01-A01-KP-27": {
    postcode: "FC-01-A01-KP-27",
    valid: true,
    administrative_address: {
      state_name: "FCT",
      lga_name: "ABUJA MUNICIPAL AREA COUNCIL",
      locality_name: "CENTRAL BUSINESS DISTRICT",
      zone: "NORTH CENTRAL",
    },
    recent_house_address: {
      recent: "NIPOST HEADQUARTERS, HERBERT MACAULAY WAY, GARKI, ABUJA",
    },
    building_use_status: "commercial",
    coordinates: { lat: 9.0579, lng: 7.4951 },
  },
  "FC-01-A01-LR-01": {
    postcode: "FC-01-A01-LR-01",
    valid: true,
    administrative_address: {
      state_name: "FCT",
      lga_name: "ABUJA MUNICIPAL AREA COUNCIL",
      locality_name: "GARKI",
      zone: "NORTH CENTRAL",
    },
    recent_house_address: {
      recent: "PLOT 42 TAFAWA BALEWA WAY, AREA 11, GARKI, ABUJA",
    },
    building_use_status: "commercial",
    coordinates: { lat: 9.0412, lng: 7.4894 },
  },
  "OG-14-T18-BN-16": {
    postcode: "OG-14-T18-BN-16",
    valid: true,
    administrative_address: {
      state_name: "OGUN",
      lga_name: "IFO",
      locality_name: "AKUTE",
      zone: "SOUTH WEST",
    },
    recent_house_address: {
      recent: "22 ALAGBOLE AKUTE ROAD, IFO, OGUN STATE",
    },
    building_use_status: "residential",
    coordinates: { lat: 6.6782, lng: 3.3814 },
  },
  "EK-01-A03-FK-01": {
    postcode: "EK-01-A03-FK-01",
    valid: true,
    administrative_address: {
      state_name: "EKITI",
      lga_name: "ADO EKITI",
      locality_name: "ADO EKITI",
      zone: "SOUTH WEST",
    },
    recent_house_address: {
      recent: "NTA ROAD, BACK OF FABIAN HOTEL, ADO EKITI",
    },
    building_use_status: "residential",
    coordinates: { lat: 7.6211, lng: 5.2215 },
  },
};

export const ZONE_RIDERS = {
  "LA-11-W06": { name: "Tunde Bakare", phone: "0803 400 1122", bike: "LAG-402-XM", baseFee: 2000 },
  "FC-01-A01": { name: "Ibrahim Musa", phone: "0802 900 3344", bike: "ABJ-819-KT", baseFee: 1800 },
  "OG-14-T18": { name: "Segun Adeyemi", phone: "0816 700 5566", bike: "OGN-215-QA", baseFee: 2800 },
  "EK-01-A03": { name: "Femi Daramola", phone: "0809 200 7788", bike: "EKT-109-ZR", baseFee: 1500 },
};

export const SAMPLE_CHAT_PRESETS = [
  {
    label: "Lagos Buyer (Spaces + Flat + Phone)",
    text: "Hello vendor, I just paid for the sneakers. My postcode is la 11 w06 tc 10, Flat 3B Second Floor. Call me on 08031234567.",
  },
  {
    label: "Abuja Office Buyer (Compact Code)",
    text: "Deliver the laptop stand to FC01A01KP27, Suite 402 Left Wing. Recipient phone: 08098765432",
  },
  {
    label: "Ogun Buyer (Canonical Code)",
    text: "Postcode is OG-14-T18-BN-16, yellow gate duplex. My number is 08165554433.",
  },
  {
    label: "Invalid Code Test (00 Segment)",
    text: "Please send to LA-00-W06-TC-10, Flat 1A, 08022223333",
  },
];

export function normalizePostcode(rawInput = "") {
  const clean = rawInput.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (clean.length !== 11) {
    return clean;
  }
  return `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4, 7)}-${clean.slice(7, 9)}-${clean.slice(9, 11)}`;
}

export function disassemblePostcode(code) {
  const canonical = normalizePostcode(code);
  const pattern = /^([A-Z]{2})-(0[1-9]|[1-9][0-9])-([A-Z0-9]{3})-([A-Z]{2})-(0[1-9]|[1-9][0-9])$/;
  const match = canonical.match(pattern);

  if (!match) {
    return null;
  }

  return {
    canonical,
    clusterKey: `${match[1]}-${match[2]}-${match[3]}`,
    segments: {
      state: match[1],
      lga: match[2],
      district: match[3],
      area: match[4],
      unit: match[5],
    },
  };
}

/**
 * Extracts NIPOST postcode candidate, Nigerian phone number, and unit/landmark note
 * from an unstructured customer WhatsApp message.
 */
export function parseWhatsAppMessage(messageText = "") {
  // Match 11-character postcode pattern with hyphens, spaces, or compact
  const postcodeRegex = /\b([A-Za-z]{2})[\s-]?(\d{2})[\s-]?([A-Za-z0-9]{3})[\s-]?([A-Za-z]{2})[\s-]?(\d{2})\b/;
  const codeMatch = messageText.match(postcodeRegex);

  const rawPostcode = codeMatch
    ? `${codeMatch[1]}-${codeMatch[2]}-${codeMatch[3]}-${codeMatch[4]}-${codeMatch[5]}`.toUpperCase()
    : null;

  // Match Nigerian phone number (070, 080, 081, 090, 091, or +234)
  const phoneRegex = /(?:\+?234|0)[789][01]\d[\s-]?\d{3}[\s-]?\d{4}\b/;
  const phoneMatch = messageText.match(phoneRegex);
  const extractedPhone = phoneMatch ? phoneMatch[0].trim() : "Not provided in chat";

  // Extract unit/apartment/suite details if present
  const unitRegex = /\b(?:flat|suite|floor|apt|apartment|room|unit|wing|block|duplex|gate)[^.,;\n]*/i;
  const unitMatch = messageText.match(unitRegex);
  const extractedUnitNote = unitMatch
    ? unitMatch[0].trim()
    : "Standard Main Entrance Drop-off";

  return {
    rawPostcode,
    extractedPhone,
    extractedUnitNote,
  };
}

export async function processCustomerWhatsAppOrder(messageText, apiKey = "") {
  const parsed = parseWhatsAppMessage(messageText);

  if (!parsed.rawPostcode) {
    return {
      ok: false,
      botReply:
        "I could not find an 11-character NIPOST postcode in your message. Please reply with your building postcode (for example: LA-11-W06-TC-10) so we can generate your dispatch ticket.",
      ticket: null,
    };
  }

  const disassembled = disassemblePostcode(parsed.rawPostcode);

  if (!disassembled) {
    return {
      ok: false,
      botReply: `The postcode "${parsed.rawPostcode}" has an invalid format. NIPOST numeric segments (LGA and Building Unit) must be between 01 and 99 and cannot be 00. Please check your code and resend.`,
      ticket: null,
    };
  }

  const { canonical, clusterKey, segments } = disassembled;
  const endpointUrl = `${BASE_URL}/lookup?code=${encodeURIComponent(canonical)}&level=3`;

  let addressRecord = null;
  let sourceMode = "sandbox_fallback";

  if (apiKey && apiKey.trim() !== "") {
    try {
      const response = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          "X-API-Key": apiKey.trim(),
          Accept: "application/json",
        },
      });
      const result = await response.json();

      if (!response.ok || !result?.data?.valid) {
        return {
          ok: false,
          botReply: `NIPOST API could not verify postcode ${canonical}. Please confirm your 11-character building code.`,
          ticket: null,
        };
      }

      const fallbackCoords = NIPOST_SANDBOX_DB[canonical]?.coordinates || {
        lat: 6.5818,
        lng: 3.3568,
      };
      addressRecord = {
        ...result.data,
        coordinates: result.data.coordinates || fallbackCoords,
      };
      sourceMode = "live_api";
    } catch (err) {
      return {
        ok: false,
        botReply: `Network error connecting to NIPOST API (${err.message}).`,
        ticket: null,
      };
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 250));
    addressRecord = NIPOST_SANDBOX_DB[canonical];
    if (!addressRecord) {
      return {
        ok: false,
        botReply: `Postcode ${canonical} is valid in structure, but not in the offline demo set. Try LA-11-W06-TC-10, FC-01-A01-KP-27, OG-14-T18-BN-16, or EK-01-A03-FK-01.`,
        ticket: null,
      };
    }
  }

  const rider = ZONE_RIDERS[clusterKey] || {
    name: "Central Dispatch Rider",
    phone: "0803 000 9900",
    bike: `${segments.state}-501-DP`,
    baseFee: 2500,
  };

  const commercialDiscount =
    addressRecord.building_use_status === "commercial" ? -200 : 0;
  const dispatchFee = rider.baseFee + commercialDiscount;

  const ticketId = `DSP-${canonical.slice(0, 2)}${canonical.slice(-2)}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${addressRecord.recent_house_address.recent}, ${addressRecord.administrative_address.state_name}, Nigeria`
  )}`;

  const riderForwardText = [
    `*NIPOST VERIFIED DISPATCH TICKET (${ticketId})*`,
    `Postcode: ${canonical}`,
    `Street: ${addressRecord.recent_house_address.recent}`,
    `LGA / State: ${addressRecord.administrative_address.lga_name}, ${addressRecord.administrative_address.state_name}`,
    `Building Type: ${addressRecord.building_use_status.toUpperCase()}`,
    `Unit / Note: ${parsed.extractedUnitNote}`,
    `Customer Phone: ${parsed.extractedPhone}`,
    `Assigned Rider: ${rider.name} (${rider.bike})`,
    `Delivery Fee: NGN ${dispatchFee.toLocaleString()}`,
    `Map Link: ${mapsUrl}`,
  ].join("\n");

  const botReply = `Address Verified! Your dispatch ticket *${ticketId}* is ready for *${addressRecord.recent_house_address.recent}* (${canonical}). Rider *${rider.name}* (${rider.bike}) has been assigned. Delivery fee: ₦${dispatchFee.toLocaleString()}.`;

  return {
    ok: true,
    botReply,
    ticket: {
      ticketId,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      canonical,
      clusterKey,
      segments,
      endpointUrl,
      sourceMode,
      addressData: addressRecord,
      customerPhone: parsed.extractedPhone,
      unitNote: parsed.extractedUnitNote,
      rider,
      dispatchFee,
      mapsUrl,
      riderForwardText,
    },
  };
}
