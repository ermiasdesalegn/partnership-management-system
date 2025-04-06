/* eslint-disable react/prop-types */
import {motion} from "framer-motion"
import {FaUserCircle} from "react-icons/fa"
import {BiLogOut} from "react-icons/bi"

const TitleSection = ({open}) => {
  return (
    <div className='mb-3 border-b border-slate-300 pb-3'>
      <div className='flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100'>
        <div className='flex items-center gap-2'>
          <FaUserCircle className='mr-2' size={20} />
          {open && (
            <motion.div
              layout
              initial={{opacity: 0, y: 12}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.125}}
            >
              <span className='block text-xs font-bold'>PMS</span>
              <span className='block text-xs text-slate-500'>Cyber Admin</span>
            </motion.div>
          )}
        </div>
        <BiLogOut className='mr-2 text-red-600' />
      </div>
    </div>
  )
}

export default TitleSection
