import { Card } from '@/components'
import type { UserDetails } from '@/types'
import './UserDetailsGeneral.scss'

interface InfoItemProps {
  label: string
  value: string | number
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="info-item">
      <span className="info-item__label">{label}</span>
      <span className="info-item__value">{value}</span>
    </div>
  )
}

interface UserDetailsGeneralProps {
  user: UserDetails
}

export function UserDetailsGeneral({ user }: UserDetailsGeneralProps) {
  const { personalInfo, education, socials, guarantors } = user

  return (
    <Card className="user-details-general">
      {/* 1. Personal Information */}
      <section className="info-section">
        <h3 className="info-section__title">Personal Information</h3>
        <div className="info-section__grid">
          <InfoItem label="Full Name" value={user.username} />
          <InfoItem label="Phone Number" value={user.phoneNumber} />
          <InfoItem label="Email Address" value={user.email} />
          <InfoItem label="BVN" value={personalInfo.bvn} />
          <InfoItem label="Gender" value={personalInfo.gender} />
          <InfoItem label="Marital Status" value={personalInfo.maritalStatus} />
          <InfoItem label="Children" value={personalInfo.children} />
          <InfoItem label="Type of Residence" value={personalInfo.residenceType} />
        </div>
      </section>

      <div className="info-section__divider" />

      {/* 2. Education and Employment */}
      <section className="info-section">
        <h3 className="info-section__title">Education and Employment</h3>
        <div className="info-section__grid info-section__grid--edu">
          <InfoItem label="Level of Education" value={education.level} />
          <InfoItem label="Employment Status" value={education.status} />
          <InfoItem label="Sector of Employment" value={education.sector} />
          <InfoItem label="Duration of Employment" value={education.duration} />
          <InfoItem label="Office Email" value={education.officeEmail} />
          <InfoItem label="Monthly Income" value={education.monthlyIncome} />
          <InfoItem label="Loan Repayment" value={education.loanRepayment} />
        </div>
      </section>

      <div className="info-section__divider" />

      {/* 3. Socials */}
      <section className="info-section">
        <h3 className="info-section__title">Socials</h3>
        <div className="info-section__grid">
          <InfoItem label="Twitter" value={socials.twitter} />
          <InfoItem label="Facebook" value={socials.facebook} />
          <InfoItem label="Instagram" value={socials.instagram} />
        </div>
      </section>

      <div className="info-section__divider" />

      {/* 4. Guarantor(s) */}
      <section className="info-section">
        {guarantors.map((guarantor, index) => (
          <div key={index} className="info-section__sub-section">
            <h3 className="info-section__title">
              {index === 0 ? 'Guarantor' : ''}
            </h3>
            <div className="info-section__grid">
              <InfoItem label="Full Name" value={guarantor.fullName} />
              <InfoItem label="Phone Number" value={guarantor.phoneNumber} />
              <InfoItem label="Email Address" value={guarantor.email} />
              <InfoItem label="Relationship" value={guarantor.relationship} />
            </div>
            {index < guarantors.length - 1 && <div className="info-section__divider info-section__divider--small" />}
          </div>
        ))}
      </section>
    </Card>
  )
}
