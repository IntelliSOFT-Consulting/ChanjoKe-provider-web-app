import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import updateSVG from '../../assets/update-record.svg'
import { Button } from 'antd'

export default function SelectDialog({
  open,
  onClose,
  title,
  description,
  btnOne,
  btnTwo,
}) {
  const cancelButtonRef = useRef(null)

  const navigate = useNavigate()

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-0">
                <div className="text-1xl bg-[#163C94] py-3 text-white font-semibold sm:px-6">
                  {title}
                </div>
                <div>
                  <div className="mx-auto mt-5 flex items-center justify-center rounded-full">
                    <img className="h-20 w-20 mx-auto" src={updateSVG} />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {description}
                    </Dialog.Title>
                  </div>
                </div>
                <div className="mt-5 mb-5 mx-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <Button
                    type="primary"
                    onClick={() => {
                      onClose(false)
                      navigate(btnOne.url)
                    }}
                    className=""
                  >
                    {btnOne.text}
                  </Button>
                  <Button
                    onClick={() => {
                      onClose(false)
                      navigate(btnTwo.url)
                    }}
                    ref={cancelButtonRef}
                    className=""
                  >
                    {btnTwo.text}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
