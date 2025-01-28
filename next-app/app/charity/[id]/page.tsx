 import { notFound } from 'next/navigation'
import CharityDetails from './CharityDetails'

// This would typically come from an API or blockchain query
const charities = [
  { 
    id: 1, 
    name: 'Save the  Oceans', 
    description: 'Protecting marine life and ecosystems',
    totalRaised: '10.5 ETH',
    transactions: [
      { id: 1, donor: '0x1234...5678', amount: '0.5 ETH', date: '2023-05-01' },
      { id: 2, donor: '0x8765...4321', amount: '1.0 ETH', date: '2023-05-02' },
    ],
    topDonors: [
      { address: '0x8765...4321', totalDonated: '2.5 ETH' },
      { address: '0x1234...5678', totalDonated: '1.5 ETH' },
    ]
  },
  // ... other charities
]

export default function CharityPage({ params }: { params: { id: string } }) {
  const charity = charities.find(c => c.id === parseInt(params.id))

  if (!charity) {
    notFound()
  }

  return <CharityDetails charity={charity} />
}

