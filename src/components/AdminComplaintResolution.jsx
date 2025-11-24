import ComplaintResponseForm from './ComplaintResponseForm'

// AdminComplaintResolution now uses the new ComplaintResponseForm (Form 02)
export default function AdminComplaintResolution({ complaint, onClose, onSuccess }) {
  return (
    <ComplaintResponseForm
      complaint={complaint}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  )
}

